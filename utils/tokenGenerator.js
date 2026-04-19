// utils/tokenGenerator.js
const crypto = require('crypto');

/**
 * Generate a secure acknowledgement number for reporters
 * Format: SV-YYYYMMDD-XXXXXXXX
 */
function generateAckNumber() {
  const date = new Date();
  const dateStr = date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `SV-${dateStr}-${random}`;
}

/**
 * Generate a secure one-time token for verification
 */
function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = { generateAckNumber, generateSecureToken };
