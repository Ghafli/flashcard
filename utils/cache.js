import config from '../config';
import logger from './logger';

class Cache {
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
  }

  /**
   * Generate a cache key from parameters
   * @param {string} prefix - Key prefix
   * @param {Object} params - Parameters to include in key
   * @returns {string} Cache key
   */
  generateKey(prefix, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});
    
    return `${prefix}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Get item from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or null
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }

    if (item.expiry && Date.now() > item.expiry) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.value;
  }

  /**
   * Set item in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in seconds
   */
  set(key, value, ttl = config.cache.CACHE_DURATION) {
    const item = {
      value,
      expiry: ttl ? Date.now() + (ttl * 1000) : null
    };

    this.cache.set(key, item);
    this.stats.sets++;

    logger.debug('Cache set', { key, ttl });
  }

  /**
   * Delete item from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
    this.stats.deletes++;
    
    logger.debug('Cache delete', { key });
  }

  /**
   * Clear all items from cache
   */
  clear() {
    this.cache.clear();
    this.resetStats();
    
    logger.info('Cache cleared');
  }

  /**
   * Reset cache statistics
   */
  resetStats() {
    Object.keys(this.stats).forEach(key => {
      this.stats[key] = 0;
    });
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total ? (this.stats.hits / total * 100).toFixed(2) : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      size: this.cache.size
    };
  }

  /**
   * Middleware for caching API responses
   * @param {number} ttl - Time to live in seconds
   * @returns {Function} Express middleware
   */
  middleware(ttl = config.cache.CACHE_DURATION) {
    return (req, res, next) => {
      // Skip caching for non-GET requests
      if (req.method !== 'GET') {
        return next();
      }

      const key = this.generateKey(req.originalUrl, {
        auth: req.session?.user?.id // Include user ID for personalized responses
      });

      const cachedResponse = this.get(key);

      if (cachedResponse) {
        return res.json(cachedResponse);
      }

      // Store original res.json to intercept response
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        this.set(key, body, ttl);
        return originalJson(body);
      };

      next();
    };
  }

  /**
   * Get or set cache with async function
   * @param {string} key - Cache key
   * @param {Function} fn - Async function to get data
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<*>} Cached or fresh data
   */
  async getOrSet(key, fn, ttl = config.cache.CACHE_DURATION) {
    const cached = this.get(key);
    if (cached) {
      return cached;
    }

    try {
      const fresh = await fn();
      this.set(key, fresh, ttl);
      return fresh;
    } catch (error) {
      logger.error('Cache getOrSet error', error);
      throw error;
    }
  }
}

export default new Cache();
