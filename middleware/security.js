import { rateLimit } from 'express-rate-limit';
import config from '../config';

// Rate limiting middleware
export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.RATE_LIMIT_WINDOW * 60 * 1000,
  max: config.rateLimit.RATE_LIMIT_MAX,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers middleware
export const securityHeaders = (req, res, next) => {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  // CORS headers
  if (config.env.IS_PRODUCTION) {
    res.setHeader('Access-Control-Allow-Origin', config.security.ALLOWED_ORIGINS.join(','));
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  next();
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error response
  const error = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: config.env.IS_PRODUCTION 
        ? 'An unexpected error occurred' 
        : err.message,
    }
  };

  // Add error details in development
  if (!config.env.IS_PRODUCTION && err.details) {
    error.error.details = err.details;
  }

  // Set appropriate status code
  const status = err.status || 500;
  res.status(status).json(error);
};

// Validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw {
          status: 400,
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.details
        };
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

// Authentication middleware
export const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    });
  }
  next();
};

// File upload middleware
export const validateFileUpload = (req, res, next) => {
  if (!req.files) return next();

  const totalSize = Object.values(req.files)
    .reduce((sum, file) => sum + file.size, 0);

  if (totalSize > config.security.MAX_UPLOAD_SIZE) {
    return res.status(413).json({
      success: false,
      error: {
        code: 'FILE_TOO_LARGE',
        message: 'Upload size exceeds limit',
        details: {
          limit: config.security.MAX_UPLOAD_SIZE,
          received: totalSize
        }
      }
    });
  }
  next();
};
