const systemService = require('../services/system');
const logger = require('../logger');

function health(req, res) {
  res.json({ ok: true });
}

async function testBrowser(req, res) {
  try {
    await systemService.runBrowserTest();
    res.json({ ok: true, message: 'Browser launch test successful' });
  } catch (err) {
    logger.error(`Browser test failed: ${err.message}`);
    res.status(500).json({ ok: false, error: err.message });
  }
}

async function testUnlike(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ ok: false, error: 'Username and password are required' });
  }

  try {
    const message = await systemService.runUnlikeTest(username, password);
    res.json({ ok: true, message });
  } catch (err) {
    logger.error(`Unlike test failed: ${err.message || err.reason}`);
    if (err.status) {
      res.status(err.status).json({ ok: false, reason: err.reason });
    } else {
      res.status(500).json({ ok: false, error: err.message });
    }
  }
}

function testWs(req, res) {
  systemService.triggerWsBroadcast();
  res.json({ ok: true, message: 'Broadcast sent' });
}

module.exports = {
  health,
  testBrowser,
  testUnlike,
  testWs,
};
