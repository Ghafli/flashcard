import { format, parseISO } from 'date-fns';

/**
 * Format a date string into a human-readable format
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - Date format string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, formatStr = 'PPP') => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

/**
 * Calculate spaced repetition interval
 * @param {number} previousInterval - Previous interval in days
 * @param {number} performance - Performance rating (1-5)
 * @returns {number} Next interval in days
 */
export const calculateNextReview = (previousInterval, performance) => {
  const baseMultiplier = {
    1: 0.5,  // Reset - significant difficulty
    2: 0.75, // Hard - reduce interval
    3: 1,    // Good - keep same interval
    4: 1.5,  // Easy - increase interval
    5: 2     // Perfect - double interval
  };

  const multiplier = baseMultiplier[performance] || 1;
  const nextInterval = Math.round(previousInterval * multiplier);

  // Constraints
  const minInterval = 1;
  const maxInterval = 365;
  return Math.min(Math.max(nextInterval, minInterval), maxInterval);
};

/**
 * Validate and sanitize user input
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000);      // Limit length
};

/**
 * Generate a slug from a string
 * @param {string} str - Input string
 * @returns {string} URL-friendly slug
 */
export const generateSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Calculate study statistics
 * @param {Array} results - Array of study results
 * @returns {Object} Statistics object
 */
export const calculateStats = (results) => {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      totalCards: 0,
      correctCount: 0,
      averageScore: 0,
      timeSpent: 0
    };
  }

  const stats = results.reduce((acc, result) => {
    acc.totalCards++;
    acc.correctCount += result.performance >= 3 ? 1 : 0;
    acc.totalScore += result.performance;
    acc.timeSpent += result.timeSpent;
    return acc;
  }, { totalCards: 0, correctCount: 0, totalScore: 0, timeSpent: 0 });

  return {
    totalCards: stats.totalCards,
    correctCount: stats.correctCount,
    averageScore: Math.round((stats.totalScore / stats.totalCards) * 100) / 100,
    timeSpent: stats.timeSpent
  };
};

/**
 * Format time duration in milliseconds to human-readable string
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string
 */
export const formatDuration = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

/**
 * Check if a string is a valid MongoDB ObjectId
 * @param {string} str - String to check
 * @returns {boolean} True if valid ObjectId
 */
export const isValidObjectId = (str) => {
  return /^[0-9a-fA-F]{24}$/.test(str);
};

/**
 * Chunk an array into smaller arrays
 * @param {Array} array - Array to chunk
 * @param {number} size - Size of each chunk
 * @returns {Array} Array of chunks
 */
export const chunkArray = (array, size) => {
  return array.reduce((acc, item, i) => {
    const chunkIndex = Math.floor(i / size);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(item);
    return acc;
  }, []);
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
    );
  }
  return obj;
};
