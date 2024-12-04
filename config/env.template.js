// This is a template for environment variables
// Copy this file to .env.local and fill in your values

module.exports = {
  // Database Configuration
  database: {
    // MongoDB connection URI
    // Format: mongodb://[username:password@]host[:port]/database
    MONGODB_URI: 'mongodb://localhost:27017/flashcard',
  },

  // Authentication Configuration
  auth: {
    // Secret key for NextAuth.js session encryption
    // Generate a random string: require('crypto').randomBytes(32).toString('hex')
    NEXTAUTH_SECRET: 'your-secret-key',

    // URL for NextAuth.js callbacks
    // Development: http://localhost:3000
    // Production: https://ghafli.github.io/flashcard
    NEXTAUTH_URL: 'http://localhost:3000',
  },

  // Analytics Configuration (Optional)
  analytics: {
    // Google Analytics ID
    NEXT_PUBLIC_GA_ID: '',
  },

  // Environment Configuration
  env: {
    // Development or Production
    NODE_ENV: 'development',
  },

  // Rate Limiting Configuration
  rateLimit: {
    // Requests per window
    RATE_LIMIT_MAX: 100,
    // Time window in minutes
    RATE_LIMIT_WINDOW: 15,
  },

  // Security Configuration
  security: {
    // CORS origins
    ALLOWED_ORIGINS: ['http://localhost:3000'],
    // Maximum upload size in bytes
    MAX_UPLOAD_SIZE: 5242880, // 5MB
  },

  // Cache Configuration
  cache: {
    // Cache duration in seconds
    CACHE_DURATION: 3600,
  },
};
