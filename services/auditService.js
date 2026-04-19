// services/auditService.js
const AuditLog = require('../models/AuditLog');
const { hashSHA256 } = require('../utils/encryption');
const logger = require('../utils/logger');

async function logAction({ adminId, adminEmail, action, targetType, targetId, details, oldValue, newValue, ip }) {
  try {
    await AuditLog.create({
      adminId,
      adminEmail,
      action,
      targetType,
      targetId,
      details,
      oldValue,
      newValue,
      ipHash: ip ? hashSHA256(ip, process.env.IP_SALT) : null,
    });
  } catch (err) {
    logger.error('Audit log failed:', err.message);
  }
}

module.exports = { logAction };
