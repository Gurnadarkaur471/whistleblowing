// server.js – SecureVoice Entry Point
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const csrfProtection = require('./middleware/csrfProtection');
const path = require('path');
const fs = require('fs');

const logger = require('./utils/logger');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// ─── Validate required env vars ──────────────────────────────────────────────
const REQUIRED_ENV = ['ENCRYPTION_KEY', 'SESSION_SECRET', 'IP_SALT', 'MONGODB_URI'];
REQUIRED_ENV.forEach(key => {
  if (!process.env[key]) {
    logger.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});
if (process.env.ENCRYPTION_KEY.length !== 32) {
  logger.error('ENCRYPTION_KEY must be exactly 32 characters');
  process.exit(1);
}

// Ensure logs directory exists
if (!fs.existsSync('./logs')) fs.mkdirSync('./logs');
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
if (!fs.existsSync('./uploads/audio')) fs.mkdirSync('./uploads/audio');

const app = express();

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  },
}));

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ─── Parsers ──────────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// ─── NoSQL Injection & XSS Protection ────────────────────────────────────────
app.use(mongoSanitize());

// ─── View Engine ──────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Session ─────────────────────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
  },
  name: 'sv_session',
}));

// ─── CSRF Protection ─────────────────────────────────────────────────────────
app.use(csrfProtection);

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('✅ MongoDB connected'))
  .catch(err => {
    logger.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.render('home', { title: 'SecureVoice – Anonymous Reporting' }));
app.use('/report', reportRoutes);
app.use('/admin', adminRoutes);

// ─── Error Handlers ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 SecureVoice running at http://localhost:${PORT}`);
  logger.info(`🔐 Environment: ${process.env.NODE_ENV}`);
});
