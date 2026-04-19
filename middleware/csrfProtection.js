// middleware/csrfProtection.js
// Custom CSRF protection that works reliably with multipart/form-data
// Replaces the deprecated 'csurf' package

const crypto = require('crypto');

/**
 * Generate a random CSRF token
 */
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Timing-safe comparison of two strings
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * CSRF middleware — generates token on GET, validates on POST/PUT/DELETE/PATCH.
 * For multipart forms, the token MUST be passed via query string (?_csrf=TOKEN)
 * since req.body is not yet parsed by multer when this middleware runs.
 */
function csrfProtection(req, res, next) {
  // Ensure a CSRF token exists in the session (for all request types)
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateToken();
  }

  // Always make token available to views and controllers
  req.csrfToken = () => req.session.csrfToken;
  res.locals.csrfToken = req.session.csrfToken;

  // Safe methods — no validation needed
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Unsafe methods — validate the token
  const sessionToken = req.session.csrfToken;

  // Extract token from multiple sources
  // Query string is checked FIRST — this is critical for multipart/form-data
  // because req.body is empty until multer parses it
  const submittedToken =
    (req.query && req.query._csrf) ||       // Query string (works for multipart!)
    (req.body && req.body._csrf) ||          // URL-encoded / JSON body
    req.headers['csrf-token'] ||             // Headers
    req.headers['xsrf-token'] ||
    req.headers['x-csrf-token'] ||
    req.headers['x-xsrf-token'];

  if (!sessionToken || !submittedToken || !safeCompare(sessionToken, submittedToken)) {
    const err = new Error('Invalid CSRF token');
    err.code = 'EBADCSRFTOKEN';
    err.status = 403;
    return next(err);
  }

  // Token is valid — proceed
  next();
}

module.exports = csrfProtection;
