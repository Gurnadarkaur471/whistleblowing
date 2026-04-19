// middleware/audioUpload.js
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const ALLOWED_AUDIO_TYPES = [
  'audio/webm', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg'
];

const ALLOWED_EXTENSIONS = ['.webm', '.mp3', '.wav', '.ogg'];

const uploadDir = './uploads/audio';

// Fast checks, create if doesn't exist just in case
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const hash = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `audio_${timestamp}_${hash}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Browsers usually don't set perfect extension for blobs sometimes, using .webm safely.
  const isAllowedMime = ALLOWED_AUDIO_TYPES.includes(file.mimetype);
  
  if (isAllowedMime) {
    cb(null, true);
  } else {
    cb(new Error(`Audio type not allowed. MIME: ${file.mimetype}`), false);
  }
};

const audioUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1, // upload one at a time
  },
});

module.exports = audioUpload;
