const logger = require('../logger');
const { randomDelay } = require('../core/delay');

async function dismissPopups(page) {
  const popupTargets = [
    { selector: 'button:has-text("Not now")', name: '"Not now" button' },
    { selector: 'button:has-text("Not Now")', name: '"Not Now" button' },
    { selector: 'span:has-text("Not now")', name: '"Not now" span' },
    { selector: 'span:has-text("Not Now")', name: '"Not Now" span' },
    { selector: 'button:has-text("Save info")', name: '"Save info" button' },
    { selector: 'button:has-text("Save Info")', name: '"Save Info" button' },
    { selector: 'span:has-text("Save info")', name: '"Save info" span' },
    { selector: 'span:has-text("Save Info")', name: '"Save Info" span' },
    { selector: 'button:has-text("Cancel")', name: '"Cancel" button' },
    { selector: 'button:has-text("Later")', name: '"Later" button' },
    { selector: 'div[role="dialog"] button:has(svg[aria-label="Close"])', name: 'Dialog close button' },
    { selector: 'div[role="dialog"] svg[aria-label="Close"]', name: 'Dialog close SVG' },
    { selector: 'button svg[aria-label="Close"]', name: 'Close icon button' }
  ];

  let dismissedAny = false;

  for (const target of popupTargets) {
    try {
      const element = await page.$(target.selector);
      if (element && await element.isVisible()) {
        logger.info(`Popup detected: Dismissing with ${target.name}...`);
        await element.click({ timeout: 2000 });
        dismissedAny = true;
        await randomDelay(800, 1500);
      }
    } catch (err) {
    }
  }

  if (dismissedAny) {
    logger.info('Finished dismissing active popups.');
  }

  return dismissedAny;
}

module.exports = { dismissPopups };
