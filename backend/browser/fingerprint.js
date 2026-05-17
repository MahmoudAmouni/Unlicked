const logger = require('../logger');

async function injectFingerprint(context) {
  logger.info('Injecting anti-detection fingerprints...');
  
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

    Object.defineProperty(navigator, 'plugins', {
      get: () => [
        { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
        { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
        { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' },
      ],
    });

    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });

    delete window.__playwright;
    delete window.__pw_manual;
    delete window.playwright;
    
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
  });
}

module.exports = { injectFingerprint };
