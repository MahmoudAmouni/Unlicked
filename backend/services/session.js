const loop = require('../core/loop');
const { loadProgress, clearProgress } = require('../core/progress');
const logger = require('../logger');

function startSession(username, password) {
  const currentStatus = loop.getState();
  if (currentStatus.status !== loop.STATES.STOPPED) {
    throw new Error('Session already in progress');
  }

  loop.runLoop(username, password).catch(err => {
    logger.error(`Background loop error: ${err.message}`);
  });
}

function stopSession() {
  loop.stop();
}

function resumeSession() {
  loop.setPaused(false);
}

function getSessionState() {
  return loop.getState();
}

function getSessionProgress() {
  return loadProgress();
}

function resetSessionProgress() {
  clearProgress();
}

module.exports = {
  startSession,
  stopSession,
  resumeSession,
  getSessionState,
  getSessionProgress,
  resetSessionProgress,
};
