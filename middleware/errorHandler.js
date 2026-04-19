// middleware/errorHandler.js
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(err.message, { stack: err.stack, url: req.originalUrl });

  // CSRF token errors
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).render('error', {
      title: 'Security Error',
      message: 'Invalid security token. Please refresh and try again.',
      code: 403,
    });
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum 5MB allowed.' });
  }

  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong. Please try again.'
    : err.message;

  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(status).json({ error: message });
  }

  res.status(status).render('error', {
    title: 'Error',
    message,
    code: status,
  });
}

function notFound(req, res) {
  res.status(404).render('error', {
    title: '404 Not Found',
    message: 'The page you are looking for does not exist.',
    code: 404,
  });
}

module.exports = { errorHandler, notFound };
