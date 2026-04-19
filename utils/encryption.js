// utils/encryption.js
// AES-256-CBC encryption with unique IV per operation

const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32;

function getKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== KEY_LENGTH) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 characters');
  }
  return Buffer.from(key, 'utf8');
}

/**
 * Encrypt a string value
 * Returns: "iv:encryptedData" format
 */
function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  let encrypted = cipher.update(String(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt an encrypted string
 * Expects: "iv:encryptedData" format
 */
function decrypt(encryptedText) {
  if (!encryptedText) return null;
  const [ivHex, encrypted] = encryptedText.split(':');
  if (!ivHex || !encrypted) return null;
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * SHA-256 hash (one-way, for IPs and integrity checks)
 */
function hashSHA256(value, salt = '') {
  return crypto.createHash('sha256').update(value + salt).digest('hex');
}

/**
 * Hash a report's content fields for integrity
 */
function hashReport(reportData) {
  const content = JSON.stringify({
    title: reportData.title,
    description: reportData.description,
    category: reportData.category,
    accusedOrganization: reportData.accusedOrganization,
  });
  return hashSHA256(content);
}

module.exports = { encrypt, decrypt, hashSHA256, hashReport };
