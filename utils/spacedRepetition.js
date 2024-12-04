/**
 * Spaced Repetition System (SRS) implementation
 * Based on SuperMemo 2 algorithm with modifications
 */

// Performance ratings and their meanings
export const PERFORMANCE_RATINGS = {
  AGAIN: 1,    // Complete forgetting
  HARD: 2,     // Remembered with significant difficulty
  GOOD: 3,     // Remembered with some difficulty
  EASY: 4,     // Remembered easily
  PERFECT: 5   // Perfect recall
};

// Base intervals for each difficulty level (in days)
const BASE_INTERVALS = {
  [PERFORMANCE_RATINGS.AGAIN]: 1,
  [PERFORMANCE_RATINGS.HARD]: 3,
  [PERFORMANCE_RATINGS.GOOD]: 7,
  [PERFORMANCE_RATINGS.EASY]: 14,
  [PERFORMANCE_RATINGS.PERFECT]: 30
};

// Ease factor adjustments
const EASE_ADJUSTMENTS = {
  [PERFORMANCE_RATINGS.AGAIN]: -0.3,
  [PERFORMANCE_RATINGS.HARD]: -0.15,
  [PERFORMANCE_RATINGS.GOOD]: 0,
  [PERFORMANCE_RATINGS.EASY]: 0.15,
  [PERFORMANCE_RATINGS.PERFECT]: 0.3
};

class SpacedRepetition {
  /**
   * Calculate next review interval
   * @param {Object} card - Card data
   * @param {number} performance - Performance rating (1-5)
   * @returns {Object} Next review data
   */
  calculateNextReview(card, performance) {
    // Validate performance rating
    if (!PERFORMANCE_RATINGS[Object.keys(PERFORMANCE_RATINGS)[performance - 1]]) {
      throw new Error('Invalid performance rating');
    }

    const now = new Date();
    const currentInterval = card.interval || 0;
    const currentEase = card.easeFactor || 2.5;
    
    // Calculate new interval and ease factor
    const { interval, easeFactor } = this._calculateIntervalAndEase(
      currentInterval,
      currentEase,
      performance
    );

    return {
      interval,
      easeFactor,
      nextReview: new Date(now.getTime() + interval * 24 * 60 * 60 * 1000),
      lastReview: now,
      reviewCount: (card.reviewCount || 0) + 1,
      performance
    };
  }

  /**
   * Calculate interval and ease factor
   * @private
   */
  _calculateIntervalAndEase(currentInterval, currentEase, performance) {
    let interval, easeFactor;

    // Adjust ease factor
    easeFactor = Math.max(1.3, Math.min(2.5, currentEase + EASE_ADJUSTMENTS[performance]));

    // Calculate new interval
    if (performance === PERFORMANCE_RATINGS.AGAIN) {
      // Reset interval on complete forgetting
      interval = 1;
    } else if (currentInterval === 0) {
      // First review
      interval = BASE_INTERVALS[performance];
    } else {
      // Calculate new interval based on current interval and performance
      interval = Math.round(currentInterval * easeFactor);
      
      // Apply minimum and maximum constraints
      interval = Math.max(BASE_INTERVALS[performance], Math.min(interval, 365));
    }

    return { interval, easeFactor };
  }

  /**
   * Get cards due for review
   * @param {Array} cards - Array of cards
   * @returns {Array} Cards due for review
   */
  getDueCards(cards) {
    const now = new Date();
    return cards.filter(card => {
      const nextReview = new Date(card.nextReview);
      return !nextReview || nextReview <= now;
    });
  }

  /**
   * Calculate review statistics
   * @param {Array} reviews - Array of review data
   * @returns {Object} Review statistics
   */
  calculateStats(reviews) {
    if (!reviews.length) {
      return {
        totalReviews: 0,
        averagePerformance: 0,
        retentionRate: 0
      };
    }

    const stats = reviews.reduce((acc, review) => {
      acc.totalReviews++;
      acc.performanceSum += review.performance;
      acc.retained += review.performance >= PERFORMANCE_RATINGS.GOOD ? 1 : 0;
      return acc;
    }, { totalReviews: 0, performanceSum: 0, retained: 0 });

    return {
      totalReviews: stats.totalReviews,
      averagePerformance: stats.performanceSum / stats.totalReviews,
      retentionRate: (stats.retained / stats.totalReviews) * 100
    };
  }

  /**
   * Prioritize cards for review
   * @param {Array} cards - Array of due cards
   * @returns {Array} Prioritized cards
   */
  prioritizeCards(cards) {
    return cards.sort((a, b) => {
      // Priority factors:
      // 1. Overdue cards (higher priority for more overdue)
      // 2. Cards with lower performance ratings
      // 3. Cards with fewer reviews
      
      const now = new Date();
      const aOverdue = (now - new Date(a.nextReview)) / (24 * 60 * 60 * 1000);
      const bOverdue = (now - new Date(b.nextReview)) / (24 * 60 * 60 * 1000);
      
      // Calculate priority score
      const aScore = (aOverdue * 2) + 
                    ((6 - (a.lastPerformance || 3)) * 1.5) + 
                    (1 / (a.reviewCount || 1));
      
      const bScore = (bOverdue * 2) + 
                    ((6 - (b.lastPerformance || 3)) * 1.5) + 
                    (1 / (b.reviewCount || 1));
      
      return bScore - aScore;
    });
  }

  /**
   * Get study schedule recommendations
   * @param {Array} cards - Array of all cards
   * @returns {Object} Study schedule recommendations
   */
  getStudySchedule(cards) {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const schedule = Array(7).fill(0).map((_, i) => {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      return {
        date,
        dueCards: cards.filter(card => {
          const nextReview = new Date(card.nextReview);
          return nextReview >= date && nextReview < new Date(date.getTime() + 24 * 60 * 60 * 1000);
        }).length
      };
    });

    return {
      schedule,
      totalDueNextWeek: schedule.reduce((sum, day) => sum + day.dueCards, 0),
      recommendedPerDay: Math.ceil(schedule.reduce((sum, day) => sum + day.dueCards, 0) / 7)
    };
  }
}

export default new SpacedRepetition();
