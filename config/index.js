const template = require('./env.template');

// Load environment variables with validation
function loadConfig() {
  const config = {
    database: {
      MONGODB_URI: process.env.MONGODB_URI || template.database.MONGODB_URI,
    },
    auth: {
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || template.auth.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || template.auth.NEXTAUTH_URL,
    },
    analytics: {
      NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || template.analytics.NEXT_PUBLIC_GA_ID,
    },
    env: {
      NODE_ENV: process.env.NODE_ENV || template.env.NODE_ENV,
      IS_PRODUCTION: process.env.NODE_ENV === 'production',
    },
    rateLimit: {
      RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || template.rateLimit.RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || template.rateLimit.RATE_LIMIT_WINDOW,
    },
    security: {
      ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? 
        process.env.ALLOWED_ORIGINS.split(',') : 
        template.security.ALLOWED_ORIGINS,
      MAX_UPLOAD_SIZE: parseInt(process.env.MAX_UPLOAD_SIZE) || template.security.MAX_UPLOAD_SIZE,
    },
    cache: {
      CACHE_DURATION: parseInt(process.env.CACHE_DURATION) || template.cache.CACHE_DURATION,
    },
  };

  // Validate required configurations
  const requiredConfigs = [
    ['MONGODB_URI', config.database.MONGODB_URI],
    ['NEXTAUTH_SECRET', config.auth.NEXTAUTH_SECRET],
    ['NEXTAUTH_URL', config.auth.NEXTAUTH_URL],
  ];

  for (const [key, value] of requiredConfigs) {
    if (!value) {
      throw new Error(`Missing required configuration: ${key}`);
    }
  }

  return config;
}

// Export configuration with validation
let config;
try {
  config = loadConfig();
} catch (error) {
  console.error('Configuration Error:', error.message);
  process.exit(1);
}

module.exports = config;
