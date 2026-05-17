require('dotenv').config({ path: '../.env' });

module.exports = {
  PORT: process.env.PORT || 3001,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  MIN_DELAY_MS: parseInt(process.env.MIN_DELAY_MS) || 1800,
  MAX_DELAY_MS: parseInt(process.env.MAX_DELAY_MS) || 4200,
  BREAK_EVERY_N: parseInt(process.env.BREAK_EVERY_N) || 20,
  BREAK_MIN_MS: parseInt(process.env.BREAK_MIN_MS) || 15000,
  BREAK_MAX_MS: parseInt(process.env.BREAK_MAX_MS) || 35000,
  SCROLL_PAUSE_MS: parseInt(process.env.SCROLL_PAUSE_MS) || 2000,
  LOGIN_TIMEOUT_MS: parseInt(process.env.LOGIN_TIMEOUT_MS) || 20000,
  NAV_TIMEOUT_MS: parseInt(process.env.NAV_TIMEOUT_MS) || 20000,
  MAX_UNLIKES_PER_SESSION: parseInt(process.env.MAX_UNLIKES_PER_SESSION) || 200,
  PROGRESS_FILE: process.env.PROGRESS_FILE || './data/unlike_progress.json',
  COOKIE_FILE: process.env.COOKIE_FILE || './data/cookies.json',
  LOG_FILE: process.env.LOG_FILE || './logs/unlike.log',
  HEADLESS: process.env.HEADLESS === 'true',
  VIEWPORT: { width: 390, height: 844 },
  USER_AGENT: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
};
