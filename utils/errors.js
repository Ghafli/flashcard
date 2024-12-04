/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(code, message, status = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details })
      }
    };
  }
}

// Authentication Errors
export class AuthError extends AppError {
  constructor(message = 'Authentication failed', details = null) {
    super('AUTH_ERROR', message, 401, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', details = null) {
    super('UNAUTHORIZED', message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden', details = null) {
    super('FORBIDDEN', message, 403, details);
  }
}

// Validation Errors
export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

// Resource Errors
export class NotFoundError extends AppError {
  constructor(resource = 'Resource', details = null) {
    super('NOT_FOUND', `${resource} not found`, 404, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', details = null) {
    super('CONFLICT', message, 409, details);
  }
}

// Rate Limiting Errors
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests', details = null) {
    super('RATE_LIMIT_EXCEEDED', message, 429, details);
  }
}

// Database Errors
export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', details = null) {
    super('DATABASE_ERROR', message, 500, details);
  }
}

// Input/Output Errors
export class FileUploadError extends AppError {
  constructor(message = 'File upload failed', details = null) {
    super('FILE_UPLOAD_ERROR', message, 400, details);
  }
}

export class FileSizeError extends AppError {
  constructor(message = 'File size exceeds limit', details = null) {
    super('FILE_SIZE_ERROR', message, 413, details);
  }
}

// Business Logic Errors
export class BusinessError extends AppError {
  constructor(message = 'Business rule violation', details = null) {
    super('BUSINESS_ERROR', message, 422, details);
  }
}

// External Service Errors
export class ExternalServiceError extends AppError {
  constructor(service = 'External service', details = null) {
    super('EXTERNAL_SERVICE_ERROR', `${service} request failed`, 502, details);
  }
}

// Error Factory
export const createError = (type, message, details = null) => {
  const errorTypes = {
    auth: AuthError,
    unauthorized: UnauthorizedError,
    forbidden: ForbiddenError,
    validation: ValidationError,
    notFound: NotFoundError,
    conflict: ConflictError,
    rateLimit: RateLimitError,
    database: DatabaseError,
    fileUpload: FileUploadError,
    fileSize: FileSizeError,
    business: BusinessError,
    externalService: ExternalServiceError
  };

  const ErrorClass = errorTypes[type] || AppError;
  return new ErrorClass(message, details);
};

// Error Handler
export const handleError = (error) => {
  if (error instanceof AppError) {
    return error.toJSON();
  }

  // Handle mongoose validation errors
  if (error.name === 'ValidationError') {
    return new ValidationError('Database validation failed', error.errors).toJSON();
  }

  // Handle mongoose cast errors
  if (error.name === 'CastError') {
    return new ValidationError('Invalid input format', {
      field: error.path,
      value: error.value
    }).toJSON();
  }

  // Handle mongoose duplicate key errors
  if (error.code === 11000) {
    return new ConflictError('Duplicate entry', {
      field: Object.keys(error.keyPattern)[0]
    }).toJSON();
  }

  // Handle all other errors
  console.error('Unhandled error:', error);
  return new AppError(
    'INTERNAL_SERVER_ERROR',
    'An unexpected error occurred',
    500
  ).toJSON();
};
