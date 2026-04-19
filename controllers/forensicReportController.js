// controllers/forensicReportController.js
// Handles the forensic PDF report download endpoint

const mongoose = require('mongoose');
const { createForensicPDF } = require('../services/forensicReportService');
const { logAction } = require('../services/auditService');
const { verifyPDFIntegrity, hashFileBuffer } = require('../utils/blockchain');
const Report = require('../models/Report');
const logger = require('../utils/logger');

/**
 * GET /admin/reports/:id/forensic-pdf
 * Generate and download a forensic PDF report for a specific complaint
 */
exports.downloadForensicPDF = async (req, res) => {
  try {
    const { id } = req.params;

    // ── Validate MongoDB ObjectId ──────────────────────────────────────────
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.warn(`Forensic PDF: Invalid report ID attempted – ${id}`);
      return res.status(400).json({ error: 'Invalid report ID format.' });
    }

    // ── Generate the forensic PDF ─────────────────────────────────────────
    logger.info(`Forensic PDF generation started for report: ${id} by admin: ${req.session.adminEmail}`);
    const result = await createForensicPDF(id);

    if (!result) {
      logger.warn(`Forensic PDF: Report not found – ${id}`);
      return res.status(404).json({ error: 'Report not found.' });
    }

    // ── Audit log the PDF generation ──────────────────────────────────────
    await logAction({
      adminId: req.session.adminId,
      adminEmail: req.session.adminEmail,
      action: 'GENERATE_FORENSIC_PDF',
      targetType: 'report',
      targetId: result.ackNumber,
      details: `Forensic PDF generated for report ${result.ackNumber}`,
      ip: req.ip,
    });

    // ── Set response headers and send PDF ────────────────────────────────
    const filename = `SecureVoice_Forensic_${result.ackNumber}.pdf`;

    // Ensure we have a proper Buffer
    const pdfBuffer = Buffer.isBuffer(result.pdfBuffer)
      ? result.pdfBuffer
      : Buffer.from(result.pdfBuffer);

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    });

    logger.info(`Forensic PDF generated successfully: ${result.ackNumber} (${pdfBuffer.length} bytes)`);
    res.end(pdfBuffer);

  } catch (err) {
    logger.error('Forensic PDF generation failed:', err);
    res.status(500).json({ error: 'Failed to generate forensic report. Please try again.' });
  }
};

/**
 * POST /admin/reports/:id/verify-blockchain
 * Re-verify the blockchain integrity of a report's PDF
 * Regenerates the PDF, recalculates its hash, and compares with stored blockchain data.
 */
exports.verifyBlockchain = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid report ID format.' });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    // Check if blockchain data exists
    if (!report.blockchain || !report.blockchain.hash) {
      return res.json({
        verified: false,
        status: 'NO_BLOCKCHAIN',
        message: 'No blockchain data found. Generate a Forensic PDF first to create a blockchain entry.',
        blockchain: null,
      });
    }

    // Regenerate the PDF to get a fresh hash
    const result = await createForensicPDF(id);
    if (!result) {
      return res.status(500).json({ error: 'Failed to regenerate PDF for verification.' });
    }

    // Hash the fresh PDF
    const freshPdfHash = hashFileBuffer(result.pdfBuffer);

    // Compare with stored PDF hash
    const isVerified = freshPdfHash === report.blockchain.pdfHash;

    // Audit log the verification
    await logAction({
      adminId: req.session.adminId,
      adminEmail: req.session.adminEmail,
      action: 'VERIFY_BLOCKCHAIN',
      targetType: 'report',
      targetId: report.ackNumber,
      details: `Blockchain verification: ${isVerified ? 'VERIFIED' : 'TAMPERED'}`,
      ip: req.ip,
    });

    logger.info(`Blockchain verification for ${report.ackNumber}: ${isVerified ? 'VERIFIED' : 'TAMPERED'}`);

    res.json({
      verified: isVerified,
      status: isVerified ? 'VERIFIED' : 'TAMPERED',
      message: isVerified
        ? 'PDF integrity confirmed. The document has not been tampered with.'
        : 'WARNING: PDF hash mismatch detected. The document may have been altered.',
      blockchain: {
        blockId: report.blockchain.blockId,
        hash: report.blockchain.hash,
        previousHash: report.blockchain.previousHash,
        pdfHash: report.blockchain.pdfHash,
        timestamp: report.blockchain.timestamp,
      },
      verification: {
        freshPdfHash,
        storedPdfHash: report.blockchain.pdfHash,
        match: isVerified,
      },
    });

  } catch (err) {
    logger.error('Blockchain verification failed:', err);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
};

/**
 * GET /admin/reports/:id/blockchain-status
 * Returns the current blockchain metadata for a report (no re-verification)
 */
exports.getBlockchainStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid report ID format.' });
    }

    const report = await Report.findById(id).select('ackNumber blockchain');
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    if (!report.blockchain || !report.blockchain.hash) {
      return res.json({
        exists: false,
        message: 'No blockchain data. Generate a Forensic PDF first.',
        blockchain: null,
      });
    }

    res.json({
      exists: true,
      blockchain: {
        blockId: report.blockchain.blockId,
        hash: report.blockchain.hash,
        previousHash: report.blockchain.previousHash,
        pdfHash: report.blockchain.pdfHash,
        timestamp: report.blockchain.timestamp,
        verified: report.blockchain.verified,
      },
    });

  } catch (err) {
    logger.error('Blockchain status fetch failed:', err);
    res.status(500).json({ error: 'Could not fetch blockchain status.' });
  }
};

