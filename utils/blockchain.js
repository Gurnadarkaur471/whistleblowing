// utils/blockchain.js
// Simulated Blockchain Integrity System
// Maintains an in-memory chain of SHA-256-linked blocks for tamper-proof PDF verification

const crypto = require('crypto');
const logger = require('./logger');

// ─── In-Memory Blockchain ────────────────────────────────────────────────────
// The chain is initialized with a genesis block.
// Each new block links to the previous one via previousHash,
// making any retroactive modification detectable.

const blockchain = [];

// ─── Utility: Calculate SHA-256 ──────────────────────────────────────────────
function calculateHash(data, previousHash, timestamp) {
  return crypto
    .createHash('sha256')
    .update(data + previousHash + timestamp)
    .digest('hex');
}

// ─── Create Genesis Block ────────────────────────────────────────────────────
function createGenesisBlock() {
  const timestamp = new Date('2026-01-01T00:00:00Z').toISOString();
  const block = {
    index: 0,
    timestamp,
    data: 'GENESIS_BLOCK',
    previousHash: '0',
    hash: calculateHash('GENESIS_BLOCK', '0', timestamp),
  };
  blockchain.push(block);
  logger.info('Blockchain: Genesis block created');
  return block;
}

// Initialize with genesis block
createGenesisBlock();

// ─── Create a New Block ──────────────────────────────────────────────────────
/**
 * Creates a new block and appends it to the in-memory blockchain.
 * @param {string} data - Usually the SHA-256 hash of a PDF file
 * @returns {object} The newly created block
 */
function createBlock(data) {
  const previousBlock = blockchain[blockchain.length - 1];
  const timestamp = new Date().toISOString();
  const index = previousBlock.index + 1;
  const previousHash = previousBlock.hash;

  const hash = calculateHash(data, previousHash, timestamp);

  const newBlock = {
    index,
    timestamp,
    data,
    previousHash,
    hash,
  };

  blockchain.push(newBlock);
  logger.info(`Blockchain: Block #${index} created | Hash: ${hash.substring(0, 16)}...`);

  return newBlock;
}

// ─── Get the Full Blockchain (for internal use only) ──────────────────────────
/**
 * Returns a shallow copy of the blockchain array.
 * NOTE: Never expose this publicly – admin/internal use only.
 * @returns {Array} Copy of all blocks
 */
function getBlockchain() {
  return [...blockchain];
}

// ─── Get Latest Block ─────────────────────────────────────────────────────────
/**
 * Returns the latest block in the chain
 * @returns {object} The most recent block
 */
function getLatestBlock() {
  return blockchain[blockchain.length - 1];
}

// ─── Validate Chain Integrity ─────────────────────────────────────────────────
/**
 * Validates the entire in-memory chain for integrity.
 * Checks that each block's hash matches recalculation and
 * that previousHash links are unbroken.
 * @returns {object} { isValid: boolean, brokenAt: number|null }
 */
function validateChain() {
  for (let i = 1; i < blockchain.length; i++) {
    const current = blockchain[i];
    const previous = blockchain[i - 1];

    // Recalculate and verify current block's hash
    const recalculated = calculateHash(current.data, current.previousHash, current.timestamp);
    if (current.hash !== recalculated) {
      logger.warn(`Blockchain: Integrity broken at block #${current.index} – hash mismatch`);
      return { isValid: false, brokenAt: current.index };
    }

    // Verify chain link
    if (current.previousHash !== previous.hash) {
      logger.warn(`Blockchain: Chain broken at block #${current.index} – previousHash mismatch`);
      return { isValid: false, brokenAt: current.index };
    }
  }

  return { isValid: true, brokenAt: null };
}

// ─── Hash a File Buffer ──────────────────────────────────────────────────────
/**
 * Generates SHA-256 hash of a file buffer (e.g., PDF)
 * @param {Buffer} fileBuffer - The file content as a Buffer
 * @returns {string} Hex-encoded SHA-256 hash
 */
function hashFileBuffer(fileBuffer) {
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
    throw new Error('Invalid file buffer provided for hashing');
  }
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

// ─── Verify a PDF Against Stored Blockchain Data ──────────────────────────────
/**
 * Verifies a PDF buffer's integrity against stored blockchain metadata.
 * Recalculates the hash of the PDF and compares with the stored block hash data.
 * @param {Buffer} pdfBuffer - The PDF file buffer to verify
 * @param {object} storedBlockchain - The blockchain metadata from the DB
 * @returns {object} { verified: boolean, details: object }
 */
function verifyPDFIntegrity(pdfBuffer, storedBlockchain) {
  if (!pdfBuffer || !storedBlockchain) {
    return {
      verified: false,
      status: 'ERROR',
      details: { reason: 'Missing PDF buffer or blockchain data' },
    };
  }

  const currentPdfHash = hashFileBuffer(pdfBuffer);

  // Recalculate what the block hash should be
  const recalculatedBlockHash = calculateHash(
    currentPdfHash,
    storedBlockchain.previousHash,
    storedBlockchain.timestamp.toISOString()
  );

  const verified = recalculatedBlockHash === storedBlockchain.hash;

  return {
    verified,
    status: verified ? 'VERIFIED' : 'TAMPERED',
    details: {
      currentPdfHash,
      storedBlockHash: storedBlockchain.hash,
      recalculatedBlockHash,
      blockId: storedBlockchain.blockId,
      previousHash: storedBlockchain.previousHash,
      timestamp: storedBlockchain.timestamp,
    },
  };
}

module.exports = {
  createBlock,
  getBlockchain,
  getLatestBlock,
  validateChain,
  hashFileBuffer,
  verifyPDFIntegrity,
};
