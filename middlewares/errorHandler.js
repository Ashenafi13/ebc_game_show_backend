const { AppError } = require('../utils/errors');

// Import a logging library (e.g., winston, pino, or even just console for simplicity)
const logger = console; // For simplicity, using console. You can replace this with winston, pino, etc.
// Example using winston (you'd need to install it: npm install winston)
// const winston = require('winston');
// const logger = winston.createLogger({
//   level: 'error', // Set the minimum level to log
//   format: winston.format.json(), // Log in JSON format
//   transports: [
//     new winston.transports.Console(), // Log to console
//     // new winston.transports.File({ filename: 'error.log' }), // Log to a file
//   ],
// });


/**
 * Development error handler with detailed error information
 */
const sendErrorDev = (err, res) => {
  // logger.error('DEVELOPMENT ERROR:', err); // Log detailed error in development
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    error: err,
    
  });
};

/**
 * Production error handler with limited error information
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  // Also treat errors with custom statusCode as operational (for custom service errors)
  if (err.isOperational || (err.statusCode && err.statusCode < 500)) {
    logger.info('OPERATIONAL ERROR:', err.message); // Log operational errors at info level
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      success: false,
      data: null
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    // Log error for developers - using the logger instead of console.error
    logger.error('PROGRAMMING ERROR:', err); // Log programming errors at error level

    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      success: false,
      data: null
    });
  }
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => {
  const error = new AppError('Invalid token. Please log in again.', 401);
  logger.warn('JWT ERROR:', error.message); // Log JWT errors at warning level
  return error;
};

const handleJWTExpiredError = () => {
  const error = new AppError('Your token has expired. Please log in again.', 401);
  logger.warn('JWT EXPIRED ERROR:', error.message); // Log JWT expired errors at warning level
  return error;
};

/**
 * Handle database errors
 */
const handleDBError = (err) => {
  const message = `Database error: ${err.message.split('\n')[0]}`;
  const error = new AppError(message, 500);
  logger.error('DATABASE ERROR:', error.message, err); // Log database errors at error level, include original error for context
  return error;
};

/**
 * Main error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || (err.statusCode && err.statusCode < 500 ? 'fail' : 'error');

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode;
    error.status = err.status;

    // Handle specific error types
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (err.code === 'EREQUEST' || err.code === 'ECONNREFUSED') error = handleDBError(err);

    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;