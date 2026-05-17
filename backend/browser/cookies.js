const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../logger');

const ensureDataDir = () => {
  const dataDir = path.dirname(config.COOKIE_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

async function saveCookies(context) {
  ensureDataDir();
  const cookies = await context.cookies();
  fs.writeFileSync(config.COOKIE_FILE, JSON.stringify(cookies, null, 2));
  logger.info('Cookies saved to disk.');
}

async function loadCookies(context) {
  if (fs.existsSync(config.COOKIE_FILE)) {
    try {
      const data = fs.readFileSync(config.COOKIE_FILE, 'utf8');
      const cookies = JSON.parse(data);
      if (cookies.length > 0) {
        await context.addCookies(cookies);
        logger.info('Cookies loaded from disk.');
        return true;
      }
    } catch (err) {
      logger.error(`Error loading cookies: ${err.message}`);
    }
  }
  return false;
}

function hasSavedCookies() {
  return fs.existsSync(config.COOKIE_FILE) && fs.statSync(config.COOKIE_FILE).size > 2;
}

function clearCookies() {
  if (fs.existsSync(config.COOKIE_FILE)) {
    fs.unlinkSync(config.COOKIE_FILE);
    logger.info('Cookies cleared.');
  }
}

module.exports = { saveCookies, loadCookies, hasSavedCookies, clearCookies };
