const { chromium } = require('playwright');
const config = require('../config');
const logger = require('../logger');

async function launchBrowser() {
  logger.info('Launching browser...');
  
  const browser = await chromium.launch({
    headless: config.HEADLESS,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
    ],
  });

  const context = await browser.newContext({
    userAgent: config.USER_AGENT,
    viewport: config.VIEWPORT,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    permissions: ['geolocation'],
  });

  logger.info('Browser context created.');
  return { browser, context };
}

module.exports = { launchBrowser };
