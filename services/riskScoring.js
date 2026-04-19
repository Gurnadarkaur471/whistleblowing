// services/riskScoring.js

const HIGH_RISK_KEYWORDS = [
  'murder', 'kill', 'bomb', 'weapon', 'terrorist', 'explosion',
  'bribe', 'blackmail', 'extort', 'launder', 'trafficking',
  'child', 'abuse', 'rape', 'assault',
];

const MEDIUM_RISK_KEYWORDS = [
  'fraud', 'corruption', 'embezzle', 'illegal', 'criminal',
  'hack', 'breach', 'leak', 'threat', 'coerce', 'force',
];

/**
 * Calculate risk score for a report
 */
function calculateRiskScore(reportData) {
  let score = 0;
  const factors = [];

  // 1. Severity category
  const severityScores = { low: 10, medium: 25, high: 45, critical: 65 };
  score += severityScores[reportData.severity] || 10;
  factors.push(`Severity: ${reportData.severity}`);

  // 2. Category weight
  const categoryScores = {
    corruption: 30, fraud: 25, harassment: 20,
    cybercrime: 25, environmental: 15, financial: 20, other: 10,
  };
  score += categoryScores[reportData.category] || 10;

  // 3. Evidence attached
  if (reportData.evidenceFiles && reportData.evidenceFiles.length > 0) {
    score += 15;
    factors.push('Evidence files attached');
  }

  // 4. Number of accused persons
  if (reportData.accusedPersons && reportData.accusedPersons.length > 0) {
    score += Math.min(reportData.accusedPersons.length * 5, 20);
    factors.push(`${reportData.accusedPersons.length} accused person(s)`);
  }

  // 5. High-risk keywords in description
  const descLower = (reportData.description || '').toLowerCase();
  const highKeywordsFound = HIGH_RISK_KEYWORDS.filter(k => descLower.includes(k));
  if (highKeywordsFound.length > 0) {
    score += highKeywordsFound.length * 10;
    factors.push(`High-risk keywords: ${highKeywordsFound.slice(0, 3).join(', ')}`);
  }

  const medKeywordsFound = MEDIUM_RISK_KEYWORDS.filter(k => descLower.includes(k));
  if (medKeywordsFound.length > 0) {
    score += medKeywordsFound.length * 5;
    factors.push(`Risk keywords detected`);
  }

  // Normalize to 0-100
  score = Math.min(score, 100);

  // Determine level
  let level;
  if (score >= 75) level = 'critical';
  else if (score >= 50) level = 'high';
  else if (score >= 25) level = 'medium';
  else level = 'low';

  return { score, level, factors };
}

module.exports = { calculateRiskScore };
