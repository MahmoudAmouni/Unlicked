const { hasSavedCookies, loadCookies, saveCookies } = require('../browser/cookies');
const { humanTypingDelay, randomDelay } = require('../core/delay');
const { detectCaptcha } = require('./captcha');
const logger = require('../logger');
const config = require('../config');

async function login(page, username, password) {
  logger.info(`Starting login flow for user: ${username}`);

  const cookiesLoaded = await loadCookies(page.context());
  if (cookiesLoaded) {
    await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle' });
    const isLoggedOut = await page.$('input[name="username"]');
    if (!isLoggedOut) {
      logger.info('Successfully logged in via cookies.');
      return { success: true, method: 'cookies' };
    }
    logger.info('Cookies expired or invalid. Proceeding to manual login.');
  }

  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle' });
  
  try {
    await page.waitForSelector('input[name="username"]', { timeout: config.LOGIN_TIMEOUT_MS });
  } catch (err) {
    logger.error('Login page failed to load or username field not found.');
    throw new Error('Login page timeout');
  }

  logger.info('Typing username...');
  await page.locator('input[name="username"]').fill(username);
  await randomDelay(400, 800);

  logger.info('Typing password...');
  await page.locator('input[name="password"]').fill(password);
  await randomDelay(800, 1400);

  logger.info('Clicking login button...');
  try {
    await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 8000 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: config.LOGIN_TIMEOUT_MS }),
      page.click('button[type="submit"]', { timeout: 5000 }),
    ]);
  } catch (err) {
    logger.warn(`Click/nav step: ${err.message.split('\n')[0]}`);
    const url = page.url();
    if (!url.includes('instagram.com/accounts/login')) {
      logger.info('Already navigated away from login page — treating as success.');
    } else {
      logger.warn('Still on login page, trying Enter key fallback...');
      await page.locator('input[name="password"]').press('Enter');
      await page.waitForTimeout(3000);
    }
  }

  const isCaptcha = await detectCaptcha(page);
  if (isCaptcha) {
    return { success: false, reason: 'captcha' };
  }

  const loggedInIndicator = await page.$('svg[aria-label="Home"]') || await page.$('svg[aria-label="New post"]');
  if (loggedInIndicator) {
    logger.info('Login successful.');
    await saveCookies(page.context());
    return { success: true, method: 'manual' };
  }

  const errorMsg = await page.$('div[role="alert"]');
  if (errorMsg) {
    const text = await errorMsg.innerText();
    logger.error(`Login failed: ${text}`);
    return { success: false, reason: 'invalid_credentials', message: text };
  }

  logger.error('Login failed for unknown reason.');
  return { success: false, reason: 'unknown' };
}

module.exports = { login };
