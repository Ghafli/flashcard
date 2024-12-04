import config from '../config';

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const LOG_COLORS = {
  ERROR: '\x1b[31m', // Red
  WARN: '\x1b[33m',  // Yellow
  INFO: '\x1b[36m',  // Cyan
  DEBUG: '\x1b[90m', // Gray
  RESET: '\x1b[0m'   // Reset
};

class Logger {
  constructor() {
    this.level = config.env.IS_PRODUCTION ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;
  }

  setLevel(level) {
    this.level = LOG_LEVELS[level] || LOG_LEVELS.INFO;
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const color = LOG_COLORS[level];
    const reset = LOG_COLORS.RESET;
    
    let formattedMeta = '';
    if (Object.keys(meta).length > 0) {
      formattedMeta = '\n' + JSON.stringify(meta, null, 2);
    }

    return `${color}[${timestamp}] ${level}:${reset} ${message}${formattedMeta}`;
  }

  log(level, message, meta = {}) {
    if (LOG_LEVELS[level] <= this.level) {
      const formattedMessage = this.formatMessage(level, message, meta);
      console.log(formattedMessage);

      // In production, you might want to send logs to a service
      if (config.env.IS_PRODUCTION) {
        // TODO: Implement production logging service
        // e.g., winston, bunyan, or cloud logging service
      }
    }
  }

  error(message, meta = {}) {
    if (meta instanceof Error) {
      meta = {
        name: meta.name,
        message: meta.message,
        stack: meta.stack,
        ...(meta.details && { details: meta.details })
      };
    }
    this.log('ERROR', message, meta);
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  // Performance logging
  startTimer(label) {
    if (this.level >= LOG_LEVELS.DEBUG) {
      return {
        label,
        start: process.hrtime()
      };
    }
    return null;
  }

  endTimer(timer) {
    if (timer && this.level >= LOG_LEVELS.DEBUG) {
      const [seconds, nanoseconds] = process.hrtime(timer.start);
      const duration = seconds * 1000 + nanoseconds / 1000000;
      this.debug(`${timer.label} completed`, { duration: `${duration.toFixed(2)}ms` });
    }
  }

  // Request logging
  logRequest(req, res, next) {
    const timer = this.startTimer(`${req.method} ${req.url}`);
    
    // Log request
    this.info(`Incoming ${req.method} request to ${req.url}`, {
      method: req.method,
      url: req.url,
      query: req.query,
      headers: req.headers,
      ip: req.ip
    });

    // Log response
    res.on('finish', () => {
      this.endTimer(timer);
      this.info(`Response sent for ${req.method} ${req.url}`, {
        statusCode: res.statusCode,
        responseTime: timer ? process.hrtime(timer.start)[1] / 1000000 : null
      });
    });

    next();
  }
}

export default new Logger();
