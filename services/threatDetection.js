// services/threatDetection.js
const Report = require('../models/Report');
const { hashSHA256 } = require('../utils/encryption');

/**
 * Analyze a report for spam, duplicates, and suspicious behavior
 */
async function analyzeReport(reportData, ipHash) {
  const flags = [];
  let suspicionScore = 0;

  // 1. Check for duplicate content
  const contentHash = hashSHA256(reportData.title + reportData.description);
  const duplicate = await Report.findOne({ contentHash });
  if (duplicate) {
    flags.push('Duplicate content detected');
    suspicionScore += 40;
  }

  // 2. Check submission frequency from same IP
  if (ipHash) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentFromSameIP = await Report.countDocuments({
      ipHash,
      submittedAt: { $gte: oneHourAgo },
    });
    if (recentFromSameIP >= 3) {
      flags.push('High submission frequency from same source');
      suspicionScore += 30;
    }
    if (recentFromSameIP >= 5) {
      flags.push('Possible automated abuse');
      suspicionScore += 20;
    }
  }

  // 3. Check for very short/meaningless description
  const wordCount = reportData.description.trim().split(/\s+/).length;
  if (wordCount < 10) {
    flags.push('Description too short – possible spam');
    suspicionScore += 20;
  }

  // 4. Repeated keywords pattern (spam detection)
  const words = reportData.description.toLowerCase().split(/\s+/);
  const wordFreq = {};
  words.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
  const maxRepeat = Math.max(...Object.values(wordFreq));
  if (maxRepeat > 10) {
    flags.push('Repetitive word pattern detected');
    suspicionScore += 15;
  }

  return {
    isDuplicate: !!duplicate,
    isSpam: suspicionScore >= 50,
    suspicionScore: Math.min(suspicionScore, 100),
    flags,
    contentHash,
  };
}

module.exports = { analyzeReport };
