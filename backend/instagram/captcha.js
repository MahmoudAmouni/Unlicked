const logger = require('../logger');

async function detectCaptcha(page) {
  const url = page.url();
  
  if (url.includes('/challenge/') || url.includes('/checkpoint/')) {
    logger.warn('CAPTCHA/Challenge detected via URL.');
    return true;
  }

  const indicators = [
    'Confirm your identity',
    'suspicious activity',
    'verify your account',
    'We suspended',
    'Help us confirm it\'s you',
    'Enter the 6-digit code',
  ];

  for (const text of indicators) {
    const found = await page.getByText(text, { exact: false }).isVisible();
    if (found) {
      logger.warn(`CAPTCHA/Challenge detected via text: "${text}"`);
      return true;
    }
  }

  const captchaIframe = await page.$('iframe[src*="captcha"]');
  if (captchaIframe) {
    logger.warn('CAPTCHA iframe detected.');
    return true;
  }

  return false;
}

module.exports = { detectCaptcha };
