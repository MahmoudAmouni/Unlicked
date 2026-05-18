const config = require('../config');
const logger = require('../logger');
const { longBreakDelay } = require('./delay');
const { emit } = require('../ws/emitter');

class Scheduler {
  constructor() {
    this.unlikeCount = 0;
  }

  async checkAndTakeBreak() {
    this.unlikeCount++;

    if (this.unlikeCount % config.BREAK_EVERY_N === 0) {
      const durationMs = Math.floor(
        config.BREAK_MIN_MS + Math.random() * (config.BREAK_MAX_MS - config.BREAK_MIN_MS)
      );
      
      logger.info(`Taking a long break for ${Math.round(durationMs / 1000)} seconds...`);
      emit('BREAK_STARTED', { durationMs });
      
      await new Promise(r => setTimeout(r, durationMs));
      
      emit('BREAK_ENDED', {});
      logger.info('Break ended. Resuming...');
      return true;
    }
    
    return false;
  }

  reset() {
    this.unlikeCount = 0;
  }
}

module.exports = new Scheduler();
