const { sleep } = require('../core/delay');
const config = require('../config');
const logger = require('../logger');

async function scrollDown(page) {
  logger.info('Scrolling down to load more posts...');
  
  const before = await page.evaluate(() => window.scrollY);
  const scrollAmount = 400 + Math.floor(Math.random() * 400);
  
  await page.evaluate((amt) => {
    window.scrollBy({
      top: amt,
      left: 0,
      behavior: 'smooth'
    });
  }, scrollAmount);

  await sleep(config.SCROLL_PAUSE_MS);

  const after = await page.evaluate(() => window.scrollY);
  const scrolled = after > before;
  
  if (scrolled) {
    logger.info(`Scrolled down by ~${scrollAmount}px.`);
  } else {
    logger.warn('Page did not scroll. Possibly reached the bottom.');
  }

  return { scrolled };
}

module.exports = { scrollDown };
