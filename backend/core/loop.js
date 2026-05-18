const { launchBrowser } = require('../browser/launcher');
const { injectFingerprint } = require('../browser/fingerprint');
const { login } = require('../instagram/login');
const { navigateToLikedPosts } = require('../instagram/navigate');
const { unlikeOnePost } = require('../instagram/unlike');
const { scrollDown } = require('../instagram/scroll');
const { detectCaptcha } = require('../instagram/captcha');
const { loadProgress, saveProgress } = require('./progress');
const { postUnlikeDelay, afterScrollDelay, sleep } = require('./delay');
const { emit } = require('../ws/emitter');
const scheduler = require('./scheduler');
const logger = require('../logger');
const config = require('../config');

const STATES = {
  STOPPED: 'stopped',
  RUNNING: 'running',
  PAUSED: 'paused',
  CAPTCHA: 'captcha',
  DONE: 'done',
};

let currentState = STATES.STOPPED;
let activeBrowser = null;
let sessionStats = {
  unlikedTotal: 0,
  unlikedSession: 0,
  startedAt: null,
};

function getState() {
  return {
    status: currentState,
    ...sessionStats,
  };
}

function setPaused(paused) {
  if (currentState === STATES.RUNNING && paused) {
    currentState = STATES.PAUSED;
    emit('LOG_LINE', { text: 'Session paused by user', level: 'info' });
  } else if (currentState === STATES.PAUSED && !paused) {
    currentState = STATES.RUNNING;
    emit('LOG_LINE', { text: 'Session resumed by user', level: 'info' });
  }
}

function stop() {
  currentState = STATES.STOPPED;
  emit('LOG_LINE', { text: 'Stopping session...', level: 'info' });
}

async function runLoop(username, password) {
  if (currentState !== STATES.STOPPED) {
    logger.warn('Loop already running or paused.');
    return;
  }

  currentState = STATES.RUNNING;
  sessionStats.startedAt = new Date().toISOString();
  sessionStats.unlikedSession = 0;
  
  const progress = loadProgress();
  sessionStats.unlikedTotal = progress.unliked;
  
  let browser, context;

  try {
    const result = await launchBrowser();
    browser = result.browser;
    activeBrowser = browser;
    context = result.context;

    await injectFingerprint(context);
    const page = await context.newPage();

    const loginResult = await login(page, username, password);
    if (!loginResult.success) {
      if (loginResult.reason === 'captcha') {
        currentState = STATES.CAPTCHA;
        emit('CAPTCHA_DETECTED', {});
        emit('LOG_LINE', { text: 'CAPTCHA detected during login. Please solve it in the browser window.', level: 'warn' });
      } else {
        throw new Error(loginResult.message || 'Login failed');
      }
    }

    while (currentState === STATES.CAPTCHA || currentState === STATES.PAUSED) {
      if (currentState === STATES.STOPPED) break;
      await sleep(1000);
    }

    if (currentState === STATES.STOPPED) throw new Error('Stopped by user');

    await navigateToLikedPosts(page);

    let noProgressCount = 0;
    scheduler.reset();

    while (currentState !== STATES.STOPPED && currentState !== STATES.DONE) {
      if (currentState === STATES.PAUSED) {
        await sleep(1000);
        continue;
      }

      const isCaptcha = await detectCaptcha(page);
      if (isCaptcha) {
        currentState = STATES.CAPTCHA;
        emit('CAPTCHA_DETECTED', {});
        emit('LOG_LINE', { text: 'CAPTCHA detected. Please solve it in the browser window.', level: 'warn' });
        while (currentState === STATES.CAPTCHA) {
          await sleep(1000);
          if (currentState === STATES.STOPPED) break;
        }
        continue;
      }

      const unlikedCount = await unlikeOnePost(page);

      if (unlikedCount > 0) {
        noProgressCount = 0;
        sessionStats.unlikedTotal += unlikedCount;
        sessionStats.unlikedSession += unlikedCount;

        saveProgress({
          ...progress,
          unliked: sessionStats.unlikedTotal,
          lastUpdatedAt: new Date().toISOString(),
          sessions: (progress.sessions || 0) + (sessionStats.unlikedSession === unlikedCount ? 1 : 0)
        });

        emit('PROGRESS_UPDATE', {
          total: sessionStats.unlikedTotal,
          session: sessionStats.unlikedSession
        });
        emit('LOG_LINE', { text: `Bulk unliked ${unlikedCount} posts. Total: ${sessionStats.unlikedTotal}`, level: 'unlike' });

        if (sessionStats.unlikedSession >= config.MAX_UNLIKES_PER_SESSION) {
          emit('LOG_LINE', { text: `Reached session limit of ${config.MAX_UNLIKES_PER_SESSION}. Finishing...`, level: 'info' });
          currentState = STATES.DONE;
          break;
        }

        await scheduler.checkAndTakeBreak();

        if (currentState === STATES.RUNNING) {
          await postUnlikeDelay();
        }
      } else {
        noProgressCount++;
        logger.info(`No unlike button visible (attempt ${noProgressCount}). Scrolling for more...`);
        emit('LOG_LINE', { text: 'Loading more liked posts...', level: 'info' });

        const { scrolled } = await scrollDown(page);
        await afterScrollDelay();

        if (!scrolled || noProgressCount >= 5) {
          emit('LOG_LINE', { text: 'No more liked posts found. Session complete!', level: 'info' });
          currentState = STATES.DONE;
        }
      }
    }

    if (currentState === STATES.DONE) {
      emit('SESSION_DONE', { total: sessionStats.unlikedTotal });
    } else if (currentState === STATES.STOPPED) {
      emit('SESSION_STOPPED', { total: sessionStats.unlikedTotal });
    }

  } catch (err) {
    logger.error(`Loop error: ${err.message}`);
    emit('ERROR', { message: err.message });
    emit('LOG_LINE', { text: `Error: ${err.message}`, level: 'error' });
  } finally {
    if (browser) {
      await browser.close();
      activeBrowser = null;
    }
    currentState = STATES.STOPPED;
    logger.info('Loop terminated.');
  }
}

module.exports = { runLoop, stop, setPaused, getState, STATES };
