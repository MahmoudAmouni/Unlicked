const sessionService = require('../services/session');

function start(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ ok: false, error: 'Username and password are required' });
  }

  try {
    sessionService.startSession(username, password);
    res.json({ ok: true, message: 'Session started' });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
}

function stop(req, res) {
  sessionService.stopSession();
  res.json({ ok: true, message: 'Stopping session' });
}

function resume(req, res) {
  sessionService.resumeSession();
  res.json({ ok: true, message: 'Resuming session' });
}

function status(req, res) {
  res.json(sessionService.getSessionState());
}

function getProgress(req, res) {
  res.json(sessionService.getSessionProgress());
}

function resetProgress(req, res) {
  sessionService.resetSessionProgress();
  res.json({ ok: true });
}

module.exports = {
  start,
  stop,
  resume,
  status,
  getProgress,
  resetProgress,
};
