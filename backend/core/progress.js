const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../logger');

const ensureDataDir = () => {
  const dataDir = path.dirname(config.PROGRESS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

function loadProgress() {
  ensureDataDir();
  if (!fs.existsSync(config.PROGRESS_FILE)) {
    return {
      unliked: 0,
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      sessions: 0
    };
  }
  try {
    const data = fs.readFileSync(config.PROGRESS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    logger.error(`Error loading progress: ${err.message}`);
    return { unliked: 0 };
  }
}

function saveProgress(data) {
  ensureDataDir();
  const tmp = config.PROGRESS_FILE + '.tmp';
  try {
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, config.PROGRESS_FILE);
  } catch (err) {
    logger.error(`Error saving progress: ${err.message}`);
  }
}

function clearProgress() {
  if (fs.existsSync(config.PROGRESS_FILE)) {
    fs.unlinkSync(config.PROGRESS_FILE);
  }
}

module.exports = { loadProgress, saveProgress, clearProgress };
