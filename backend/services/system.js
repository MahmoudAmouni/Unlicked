const { launchBrowser } = require('../browser/launcher');
const { injectFingerprint } = require('../browser/fingerprint');
const { login } = require('../instagram/login');
const { navigateToLikedPosts } = require('../instagram/navigate');
const { unlikeOnePost } = require('../instagram/unlike');
const { scrollDown } = require('../instagram/scroll');
const wsEmitter = require('../ws/emitter');
const logger = require('../logger');

async function runBrowserTest() {
  let browser, context;
  try {
    const result = await launchBrowser();
    browser = result.browser;
    context = result.context;
    
    await injectFingerprint(context);
    const page = await context.newPage();
    
    logger.info('Navigating to google.com for testing...');
    await page.goto('https://www.google.com', { waitUntil: 'networkidle' });
    
    await new Promise(r => setTimeout(r, 3000));
    await browser.close();
  } catch (err) {
    if (browser) await browser.close();
    throw err;
  }
}

async function runUnlikeTest(username, password) {
  let browser, context;
  try {
    const result = await launchBrowser();
    browser = result.browser;
    context = result.context;
    
    await injectFingerprint(context);
    const page = await context.newPage();
    
    const loginResult = await login(page, username, password);

    if (loginResult.success) {
      await navigateToLikedPosts(page);
      
      const unliked = await unlikeOnePost(page);
      let successMessage = '';
      
      if (unliked) {
        successMessage = 'Successfully unliked one post';
      } else {
        await scrollDown(page);
        const unlikedAfterScroll = await unlikeOnePost(page);
        
        if (unlikedAfterScroll) {
          successMessage = 'Successfully unliked one post after scrolling';
        } else {
          throw new Error('No unlike button found on the page');
        }
      }
      
      await new Promise(r => setTimeout(r, 5000));
      await browser.close();
      return successMessage;
    } else {
      await browser.close();
      throw { status: 401, reason: loginResult.reason };
    }
  } catch (err) {
    if (browser) await browser.close();
    throw err;
  }
}

function triggerWsBroadcast() {
  wsEmitter.emit('LOG_LINE', { text: 'Test broadcast from backend!', level: 'info' });
}

module.exports = {
  runBrowserTest,
  runUnlikeTest,
  triggerWsBroadcast,
};
