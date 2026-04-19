// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reportController = require('../controllers/reportController');
const upload = require('../middleware/upload');
const rateLimit = require('express-rate-limit');

// Rate limiting: max 5 submissions per hour per IP
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many submissions. Please wait before submitting again.',
  standardHeaders: true,
  legacyHeaders: false,
});

const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many tracking requests. Please wait.',
});

const msgLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many messages sent. Please wait.'
});

const audioLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many audio uploads. Please wait.'
});

// Validation rules
const submitValidation = [
  body('title').trim().isLength({ min: 10, max: 200 }).withMessage('Title must be 10–200 characters.'),
  body('description').trim().isLength({ min: 30, max: 5000 }).withMessage('Description must be 30–5000 characters.'),
  body('category').isIn(['corruption', 'fraud', 'harassment', 'cybercrime', 'environmental', 'financial', 'other'])
    .withMessage('Invalid category.'),
  body('severity').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity.'),
  body('reporterName').optional().trim().isLength({ max: 100 }).escape(),
  body('reporterContact').optional().trim().isLength({ max: 200 }).escape(),
  body('accusedOrganization').optional().trim().isLength({ max: 300 }).escape(),
  body('location').optional().trim().isLength({ max: 200 }).escape(),
];

router.get('/submit', reportController.showSubmitForm);
router.post('/submit', submitLimiter, upload.fields([{ name: 'evidence', maxCount: 3 }, { name: 'audioEvidence', maxCount: 1 }]), submitValidation, reportController.submitReport);
router.get('/confirmation/:ackNumber', reportController.showConfirmation);
router.get('/track', reportController.showTrackForm);
router.post('/track', trackLimiter, reportController.trackReport);

// Messaging Routes
router.post('/message/send', msgLimiter, reportController.sendMessage);
router.get('/message/:trackingId', reportController.getMessages);

module.exports = router;
