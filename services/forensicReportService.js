// services/forensicReportService.js
// Forensic PDF Report Generation Service
// Assembles report data, verifies integrity, renders HTML, and generates PDF

const puppeteer = require('puppeteer');
const Report = require('../models/Report');
const AuditLog = require('../models/AuditLog');
const { decrypt, hashReport, hashSHA256 } = require('../utils/encryption');
const { createBlock, hashFileBuffer, verifyPDFIntegrity } = require('../utils/blockchain');
const logger = require('../utils/logger');

// ─── HTML Sanitization ──────────────────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── Build Full Forensic Data ─────────────────────────────────────────────────
async function buildForensicData(reportId) {
  // 1. Fetch the report
  const report = await Report.findById(reportId);
  if (!report) return null;

  // 2. Decrypt sensitive fields
  const decryptedData = {
    reporterName: report.reporterName ? decrypt(report.reporterName) : 'Anonymous',
    reporterContact: report.reporterContact ? decrypt(report.reporterContact) : 'Not provided',
    title: report.title,
    description: report.description,
    category: report.category,
    severity: report.severity,
    accusedOrganization: report.accusedOrganization || 'Not specified',
    accusedPersons: report.accusedPersons || [],
    location: report.location || 'Not specified',
    evidenceFiles: report.evidenceFiles || [],
  };

  // 3. Compute section-wise SHA-256 hashes
  const sectionHashes = {
    title: hashSHA256(report.title || ''),
    description: hashSHA256(report.description || ''),
    accusedOrganization: hashSHA256(report.accusedOrganization || ''),
    accusedPersons: hashSHA256(JSON.stringify(report.accusedPersons || [])),
    evidenceFiles: hashSHA256(JSON.stringify((report.evidenceFiles || []).map(f => f.originalName))),
  };

  // 4. Recalculate content hash and compare for integrity verification
  const recalculatedHash = hashReport({
    title: report.title,
    description: report.description,
    category: report.category,
    accusedOrganization: report.accusedOrganization,
  });

  const storedHash = report.contentHash || '';
  const integrityStatus = (storedHash === recalculatedHash) ? 'VERIFIED' : 'TAMPERED';

  // 5. Fetch audit logs for this report
  const auditLogs = await AuditLog.find({
    targetId: report.ackNumber,
  }).sort({ timestamp: -1 });

  // 6. Build version history from status-change audit logs
  const versionHistory = auditLogs
    .filter(log => log.action === 'UPDATE_REPORT_STATUS')
    .map((log, index, arr) => ({
      version: arr.length - index,
      timestamp: log.timestamp,
      action: log.action,
      oldStatus: log.oldValue?.status || '—',
      newStatus: log.newValue?.status || '—',
      adminEmail: log.adminEmail || 'System',
    }))
    .reverse();

  // 7. Assemble complete forensic data
  return {
    report: {
      id: report._id,
      ackNumber: report.ackNumber,
      trackingId: report._id.toString(),
      status: report.status,
      submittedAt: report.submittedAt,
      updatedAt: report.updatedAt,
      resolvedAt: report.resolvedAt,
    },
    decryptedData,
    hashes: {
      sectionHashes,
      storedHash,
      recalculatedHash,
      previousHash: report.previousHash || '0',
    },
    integrity: {
      status: integrityStatus,
      isVerified: integrityStatus === 'VERIFIED',
    },
    risk: {
      score: report.riskScore?.score || 0,
      level: report.riskScore?.level || 'low',
      factors: report.riskScore?.factors || [],
    },
    threat: {
      isDuplicate: report.threatFlags?.isDuplicate || false,
      isSpam: report.threatFlags?.isSpam || false,
      suspicionScore: report.threatFlags?.suspicionScore || 0,
      flags: report.threatFlags?.flags || [],
    },
    blockchain: {
      blockId: report.blockchain?.blockId ?? null,
      hash: report.blockchain?.hash || null,
      previousHash: report.blockchain?.previousHash || null,
      pdfHash: report.blockchain?.pdfHash || null,
      timestamp: report.blockchain?.timestamp || null,
      verified: report.blockchain?.verified || false,
    },
    versionHistory,
    auditLogs: auditLogs.map(log => ({
      adminId: log.adminId,
      adminEmail: log.adminEmail || 'System',
      action: log.action,
      details: log.details || '',
      oldValue: log.oldValue ? JSON.stringify(log.oldValue) : '—',
      newValue: log.newValue ? JSON.stringify(log.newValue) : '—',
      timestamp: log.timestamp,
    })),
    generatedAt: new Date(),
  };
}

// ─── Render Forensic HTML Template ────────────────────────────────────────────
function generateForensicHTML(data) {
  const e = escapeHtml; // shorthand
  const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '—';

  const riskColors = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#dc2626',
  };
  const riskColor = riskColors[data.risk.level] || '#6b7280';

  // Build section hashes rows
  const sectionHashRows = Object.entries(data.hashes.sectionHashes)
    .map(([section, hash]) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #1e293b; color: #94a3b8; text-transform: capitalize;">${e(section)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #1e293b; font-family: 'Courier New', monospace; font-size: 11px; color: #e2e8f0; word-break: break-all;">${e(hash)}</td>
      </tr>
    `).join('');

  // Build version history timeline
  const versionTimeline = data.versionHistory.length > 0
    ? data.versionHistory.map(v => `
        <div style="display: flex; margin-bottom: 16px; position: relative;">
          <div style="flex-shrink: 0; width: 36px; height: 36px; background: #1e3a5f; border: 2px solid #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #60a5fa; font-weight: bold; font-size: 13px; z-index: 1;">v${v.version}</div>
          <div style="margin-left: 16px; flex: 1; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px 16px;">
            <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">${formatDate(v.timestamp)}</div>
            <div style="color: #e2e8f0; font-size: 14px;">
              <span style="background: #1e293b; padding: 2px 8px; border-radius: 4px; color: #f87171;">${e(v.oldStatus)}</span>
              <span style="color: #475569; margin: 0 8px;">→</span>
              <span style="background: #1e293b; padding: 2px 8px; border-radius: 4px; color: #34d399;">${e(v.newStatus)}</span>
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">by ${e(v.adminEmail)}</div>
          </div>
        </div>
      `).join('')
    : '<p style="color: #64748b; font-style: italic;">No status changes recorded yet.</p>';

  // Build audit logs table rows
  const auditLogRows = data.auditLogs.length > 0
    ? data.auditLogs.map(log => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 12px; white-space: nowrap;">${formatDate(log.timestamp)}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #1e293b; color: #e2e8f0; font-size: 12px;">${e(log.adminEmail)}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #1e293b; color: #60a5fa; font-size: 12px; font-weight: 600;">${e(log.action)}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #1e293b; font-family: 'Courier New', monospace; font-size: 11px; color: #f87171;">${e(log.oldValue)}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #1e293b; font-family: 'Courier New', monospace; font-size: 11px; color: #34d399;">${e(log.newValue)}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="5" style="padding: 16px; text-align: center; color: #64748b;">No audit logs recorded.</td></tr>';

  // Build evidence file list
  const evidenceList = data.decryptedData.evidenceFiles.length > 0
    ? data.decryptedData.evidenceFiles.map(f => `
        <div style="display: flex; align-items: center; padding: 8px 12px; background: #0f172a; border: 1px solid #1e293b; border-radius: 6px; margin-bottom: 6px;">
          <span style="color: #60a5fa; margin-right: 8px;">📎</span>
          <span style="color: #e2e8f0; font-size: 13px;">${e(f.originalName)}</span>
          <span style="color: #64748b; font-size: 11px; margin-left: auto;">${f.size ? (f.size / 1024).toFixed(1) + ' KB' : ''} · ${e(f.mimeType || '')}</span>
        </div>
      `).join('')
    : '<p style="color: #64748b; font-style: italic;">No evidence files attached.</p>';

  // Build accused persons list
  const accusedList = data.decryptedData.accusedPersons.length > 0
    ? data.decryptedData.accusedPersons.map(p => `<span style="background: #1e293b; color: #e2e8f0; padding: 4px 10px; border-radius: 4px; font-size: 13px; margin-right: 6px; margin-bottom: 4px; display: inline-block;">${e(p)}</span>`).join('')
    : '<span style="color: #64748b; font-style: italic;">None specified</span>';

  // Risk factors list
  const riskFactors = data.risk.factors.length > 0
    ? data.risk.factors.map(f => `<li style="color: #cbd5e1; font-size: 13px; margin-bottom: 4px;">${e(f)}</li>`).join('')
    : '<li style="color: #64748b; font-style: italic;">No risk factors identified</li>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forensic Report – ${e(data.report.ackNumber)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #020617;
      color: #e2e8f0;
      line-height: 1.6;
      padding: 0;
    }
    .page {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #1e3a5f;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #60a5fa;
      letter-spacing: 2px;
      margin-bottom: 4px;
    }
    .header .subtitle {
      font-size: 13px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    .header .report-id {
      margin-top: 12px;
      font-family: 'Courier New', monospace;
      font-size: 16px;
      color: #94a3b8;
      background: #0f172a;
      display: inline-block;
      padding: 6px 16px;
      border-radius: 6px;
      border: 1px solid #1e293b;
    }
    .section {
      margin-bottom: 28px;
      background: #0c1527;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 20px 24px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #3b82f6;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #1e293b;
    }
    .detail-row {
      display: flex;
      margin-bottom: 10px;
    }
    .detail-label {
      flex-shrink: 0;
      width: 160px;
      color: #64748b;
      font-size: 13px;
      font-weight: 600;
    }
    .detail-value {
      color: #e2e8f0;
      font-size: 14px;
      flex: 1;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      text-align: left;
      padding: 10px 12px;
      background: #1e293b;
      color: #94a3b8;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-verified {
      background: rgba(34, 197, 94, 0.15);
      color: #22c55e;
      border: 1px solid #22c55e;
    }
    .badge-tampered {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border: 1px solid #ef4444;
    }
    .risk-bar-bg {
      width: 100%;
      height: 12px;
      background: #1e293b;
      border-radius: 6px;
      overflow: hidden;
      margin-top: 8px;
    }
    .risk-bar-fill {
      height: 100%;
      border-radius: 6px;
      transition: width 0.3s;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #1e293b;
      color: #475569;
      font-size: 11px;
    }
    .confidential {
      color: #ef4444;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    @media print {
      body { background: #020617; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- ═══ HEADER ═══ -->
    <div class="header">
      <div class="confidential">⬤ Confidential – Forensic Document</div>
      <h1>🛡️ SecureVoice</h1>
      <div class="subtitle">Forensic Investigation Report</div>
      <div class="report-id">ACK: ${e(data.report.ackNumber)}</div>
      <div style="margin-top: 8px; font-size: 12px; color: #475569;">
        Generated: ${formatDate(data.generatedAt)} · Tracking ID: ${e(data.report.trackingId)}
      </div>
    </div>

    <!-- ═══ REPORT DETAILS ═══ -->
    <div class="section">
      <div class="section-title">📋 Report Details</div>

      <div class="detail-row">
        <div class="detail-label">Title</div>
        <div class="detail-value" style="font-weight: 600;">${e(data.decryptedData.title)}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Description</div>
        <div class="detail-value" style="font-size: 13px; white-space: pre-wrap;">${e(data.decryptedData.description)}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Category</div>
        <div class="detail-value"><span class="badge" style="background: #1e3a5f; color: #60a5fa; border: 1px solid #3b82f6;">${e(data.decryptedData.category)}</span></div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Severity</div>
        <div class="detail-value"><span class="badge" style="background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid #ef4444;">${e(data.decryptedData.severity)}</span></div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Status</div>
        <div class="detail-value"><span class="badge" style="background: #1e293b; color: #94a3b8; border: 1px solid #334155;">${e(data.report.status)}</span></div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Accused Org</div>
        <div class="detail-value">${e(data.decryptedData.accusedOrganization)}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">People Involved</div>
        <div class="detail-value">${accusedList}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Location</div>
        <div class="detail-value">${e(data.decryptedData.location)}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Reporter Name</div>
        <div class="detail-value">${e(data.decryptedData.reporterName)}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Reporter Contact</div>
        <div class="detail-value">${e(data.decryptedData.reporterContact)}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Submitted At</div>
        <div class="detail-value">${formatDate(data.report.submittedAt)}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Last Updated</div>
        <div class="detail-value">${formatDate(data.report.updatedAt)}</div>
      </div>

      <div style="margin-top: 12px;">
        <div class="detail-label" style="margin-bottom: 8px;">Evidence Files</div>
        ${evidenceList}
      </div>
    </div>

    <!-- ═══ INTEGRITY & HASHES ═══ -->
    <div class="section">
      <div class="section-title">🔐 Integrity & Hash Verification</div>

      <div style="text-align: center; margin-bottom: 20px;">
        <span class="badge ${data.integrity.isVerified ? 'badge-verified' : 'badge-tampered'}" style="font-size: 16px; padding: 8px 24px;">
          ${data.integrity.isVerified ? '✅ INTEGRITY VERIFIED' : '⚠️ INTEGRITY TAMPERED'}
        </span>
      </div>

      <div class="detail-row">
        <div class="detail-label">Stored Hash</div>
        <div class="detail-value" style="font-family: 'Courier New', monospace; font-size: 11px; word-break: break-all; color: #94a3b8;">${e(data.hashes.storedHash)}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Recalculated Hash</div>
        <div class="detail-value" style="font-family: 'Courier New', monospace; font-size: 11px; word-break: break-all; color: ${data.integrity.isVerified ? '#22c55e' : '#ef4444'};">${e(data.hashes.recalculatedHash)}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Previous Hash</div>
        <div class="detail-value" style="font-family: 'Courier New', monospace; font-size: 11px; word-break: break-all; color: #64748b;">${e(data.hashes.previousHash)}</div>
      </div>

      <div style="margin-top: 16px;">
        <div class="detail-label" style="margin-bottom: 8px;">Section-wise Hashes (SHA-256)</div>
        <table>
          <thead>
            <tr>
              <th style="width: 160px;">Field</th>
              <th>SHA-256 Hash</th>
            </tr>
          </thead>
          <tbody>
            ${sectionHashRows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══ VERSION HISTORY ═══ -->
    <div class="section">
      <div class="section-title">📜 Version History</div>
      <div style="position: relative; padding-left: 18px; border-left: 2px solid #1e293b; margin-left: 18px;">
        ${versionTimeline}
      </div>
    </div>

    <!-- ═══ AUDIT LOGS ═══ -->
    <div class="section">
      <div class="section-title">🕵️ Audit Logs</div>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Admin</th>
              <th>Action</th>
              <th>Old Value</th>
              <th>New Value</th>
            </tr>
          </thead>
          <tbody>
            ${auditLogRows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══ RISK ANALYSIS ═══ -->
    <div class="section">
      <div class="section-title">⚡ Risk Analysis</div>

      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <div style="font-size: 42px; font-weight: 800; color: ${riskColor}; margin-right: 16px;">${data.risk.score}</div>
        <div>
          <span class="badge" style="background: ${riskColor}22; color: ${riskColor}; border: 1px solid ${riskColor}; font-size: 14px; text-transform: uppercase;">${e(data.risk.level)}</span>
          <div style="color: #64748b; font-size: 12px; margin-top: 4px;">Risk Score (0–100)</div>
        </div>
      </div>

      <div class="risk-bar-bg">
        <div class="risk-bar-fill" style="width: ${data.risk.score}%; background: ${riskColor};"></div>
      </div>

      <div style="margin-top: 16px;">
        <div class="detail-label" style="margin-bottom: 6px;">Contributing Factors</div>
        <ul style="padding-left: 20px;">
          ${riskFactors}
        </ul>
      </div>

      ${data.threat.flags.length > 0 ? `
        <div style="margin-top: 16px; padding: 12px 16px; background: rgba(239,68,68,0.08); border: 1px solid #7f1d1d; border-radius: 8px;">
          <div style="color: #f87171; font-weight: 600; font-size: 13px; margin-bottom: 6px;">⚠️ Threat Flags</div>
          <ul style="padding-left: 20px;">
            ${data.threat.flags.map(f => `<li style="color: #fca5a5; font-size: 12px;">${e(f)}</li>`).join('')}
          </ul>
          <div style="margin-top: 6px; font-size: 11px; color: #64748b;">Suspicion Score: ${data.threat.suspicionScore}/100</div>
        </div>
      ` : ''}
    </div>

    <!-- ═══ BLOCKCHAIN VERIFICATION ═══ -->
    ${data.blockchain && data.blockchain.blockId !== null ? `
    <div class="section">
      <div class="section-title">🔗 Blockchain Verification</div>

      <div style="text-align: center; margin-bottom: 20px;">
        <span class="badge ${data.blockchain.verified ? 'badge-verified' : 'badge-tampered'}" style="font-size: 16px; padding: 8px 24px;">
          ${data.blockchain.verified ? '✅ BLOCKCHAIN VERIFIED' : '⚠️ BLOCKCHAIN UNVERIFIED'}
        </span>
      </div>

      <div class="detail-row">
        <div class="detail-label">Block ID</div>
        <div class="detail-value" style="font-family: 'Courier New', monospace; font-size: 14px; color: #60a5fa;">#${data.blockchain.blockId}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Block Hash</div>
        <div class="detail-value" style="font-family: 'Courier New', monospace; font-size: 11px; word-break: break-all; color: #e2e8f0;">${e(data.blockchain.hash || '—')}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Previous Hash</div>
        <div class="detail-value" style="font-family: 'Courier New', monospace; font-size: 11px; word-break: break-all; color: #64748b;">${e(data.blockchain.previousHash || '—')}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">PDF Hash</div>
        <div class="detail-value" style="font-family: 'Courier New', monospace; font-size: 11px; word-break: break-all; color: #94a3b8;">${e(data.blockchain.pdfHash || '—')}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Timestamp</div>
        <div class="detail-value">${data.blockchain.timestamp ? formatDate(data.blockchain.timestamp) : '—'}</div>
      </div>
    </div>
    ` : ''}

    <!-- ═══ FOOTER ═══ -->
    <div class="footer">
      <div class="confidential" style="margin-bottom: 8px;">⬤ End of Forensic Report</div>
      <p>This document was auto-generated by <strong>SecureVoice Forensic Engine</strong></p>
      <p>Report ID: ${e(data.report.ackNumber)} · Generated: ${formatDate(data.generatedAt)}</p>
      <p style="margin-top: 8px; color: #334155;">This report is confidential. Unauthorized distribution is prohibited.</p>
    </div>

  </div>
</body>
</html>`;
}

// ─── Generate PDF from HTML ─────────────────────────────────────────────────
async function generatePDF(html) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });

    // Small delay to ensure all styles are rendered
    await new Promise(resolve => setTimeout(resolve, 500));

    const pdfResult = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '40px',
        left: '20px',
      },
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `
        <div style="width: 100%; text-align: center; font-size: 9px; color: #475569; font-family: sans-serif;">
          SecureVoice Forensic Report &middot; Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `,
    });

    // IMPORTANT: Newer Puppeteer returns Uint8Array, not Buffer.
    // We must convert to a proper Node.js Buffer for correct HTTP response.
    const pdfBuffer = Buffer.from(pdfResult);
    return pdfBuffer;
  } finally {
    if (browser) await browser.close();
  }
}

// ─── Main Export: Build data + render HTML + generate PDF ────────────────────
async function createForensicPDF(reportId) {
  // Step 1: Build the forensic data
  const forensicData = await buildForensicData(reportId);
  if (!forensicData) return null;

  // Step 2: Render the HTML template
  const html = generateForensicHTML(forensicData);

  // Step 3: Generate PDF
  const pdfBuffer = await generatePDF(html);

  // Step 4: Blockchain — hash PDF and create block
  try {
    const pdfHash = hashFileBuffer(pdfBuffer);
    const block = createBlock(pdfHash);

    // Step 5: Save blockchain metadata to the report document
    await Report.findByIdAndUpdate(reportId, {
      blockchain: {
        blockId: block.index,
        hash: block.hash,
        previousHash: block.previousHash,
        pdfHash: pdfHash,
        timestamp: new Date(block.timestamp),
        verified: true,
      },
    });

    logger.info(`Blockchain: PDF hashed & block #${block.index} saved for report ${forensicData.report.ackNumber}`);
  } catch (blockchainErr) {
    // Non-fatal: log but still return the PDF
    logger.error('Blockchain integration error:', blockchainErr);
  }

  return {
    pdfBuffer,
    ackNumber: forensicData.report.ackNumber,
  };
}

module.exports = { createForensicPDF, buildForensicData };
