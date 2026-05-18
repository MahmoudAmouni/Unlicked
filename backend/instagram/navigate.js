const logger = require('../logger');
const config = require('../config');
const { dismissPopups } = require('./dialogs');

const LIKED_POSTS_URLS = [
  'https://www.instagram.com/your_activity/interactions/likes/',
  'https://www.instagram.com/your_activity/interactions/likes',
];

async function navigateToLikedPosts(page) {
  logger.info('Navigating to Liked Posts page...');
  
  await page.goto(LIKED_POSTS_URLS[0], { 
    waitUntil: 'domcontentloaded', 
    timeout: config.NAV_TIMEOUT_MS 
  });

  await page.waitForTimeout(3000);

  await dismissPopups(page);

  const currentUrl = page.url();

  logger.info(`Current URL: ${currentUrl}`);

  if (currentUrl.includes('/accounts/login')) {
    throw new Error('Redirected to login page. Session may have expired.');
  }

  try {
    await page.waitForSelector(
      'article, [aria-label="Unlike"], [aria-label*="Unlike"], main section, ._aagu',
      { timeout: 10000 }
    );
    logger.info('Liked Posts page content loaded successfully.');
  } catch (err) {
    logger.warn('Could not confirm page content via selector. Proceeding anyway...');
    try {
      const title = await page.title();
      logger.info(`Page title: ${title}`);
    } catch (_) {}
  }
}

module.exports = { navigateToLikedPosts };
