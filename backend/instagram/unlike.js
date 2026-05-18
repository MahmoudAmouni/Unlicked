const { randomDelay } = require('../core/delay');
const logger = require('../logger');
const { navigateToLikedPosts } = require('./navigate');
const { dismissPopups } = require('./dialogs');

async function unlikeOnePost(page) {
  const targetUrlPart = '/your_activity/interactions/likes';
  if (!page.url().includes(targetUrlPart)) {
    logger.info('Re-navigating to Liked Posts...');
    await navigateToLikedPosts(page);
    await randomDelay(1000, 1500);
  } else {
    await dismissPopups(page);
  }

  const hasCheckboxes = await page.$('[aria-label="Toggle checkbox"]');
  if (!hasCheckboxes) {
    try {
      const selectBtn = await page.$('span:has-text("Select"), button:has-text("Select")');
      if (selectBtn && await selectBtn.isVisible()) {
        await selectBtn.click();
        await randomDelay(1000, 1500);
      }
    } catch (_) {}
  }

  const SELECT_SELECTOR = '[aria-label="Toggle checkbox"]';
  let elements;
  try {
    elements = await page.$$(SELECT_SELECTOR);
  } catch (_) {
    return 0;
  }

  let selectedCount = 0;
  const maxToSelect = 8;
  const viewport = page.viewportSize();

  for (const el of elements) {
    if (selectedCount >= maxToSelect) break;

    try {
      if (!(await el.isVisible())) continue;
      
      const box = await el.boundingBox();
      if (!box || box.y < 70 || (box.y + box.height) > viewport.height - 100) {
        continue; 
      }

      await el.click({ timeout: 2000, force: true });
      selectedCount++;
      await randomDelay(200, 400);
    } catch (_) {
      continue;
    }
  }

  if (selectedCount === 0) {
    return 0;
  }

  logger.info(`Selected ${selectedCount} posts. Looking for Unlike button...`);

  await randomDelay(1000, 1500);

  const UNLIKE_SELECTORS = [
    'button:has-text("Unlike")',
    'button[aria-label="Unlike"]',
    '[role="button"][aria-label="Unlike"]',
    'span:has-text("Unlike")',
  ];

  let unliked = false;
  for (const selector of UNLIKE_SELECTORS) {
    try {
      const btn = await page.$(selector);
      if (btn && await btn.isVisible()) {
        logger.info(`Clicking Unlike button found via "${selector}"`);
        await btn.click({ timeout: 5000 });
        unliked = true;
        break;
      }
    } catch (_) {}
  }

  if (unliked) {
    try {
      await randomDelay(800, 1500);
      const confirmBtn = await page.$('button:has-text("Unlike")');
      if (confirmBtn && await confirmBtn.isVisible()) {
        await confirmBtn.click({ timeout: 4000 });
        logger.info('Confirmed bulk unlike.');
      }
    } catch (_) {}

    await randomDelay(2500, 4000);
    return selectedCount;
  }

  logger.warn('Could not find Unlike button. Deselecting all...');
  try {
    await page.keyboard.press('Escape');
    await randomDelay(1000, 1500);
  } catch (_) {}
  
  return 0;
}

module.exports = { unlikeOnePost };
