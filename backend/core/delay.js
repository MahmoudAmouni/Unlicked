const config = require('../config');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const randomDelay = (min, max) =>
  sleep(Math.floor(Math.random() * (max - min)) + min);

const postUnlikeDelay = () =>
  randomDelay(config.MIN_DELAY_MS, config.MAX_DELAY_MS);

const afterScrollDelay = () =>
  randomDelay(1500, 3000);

const longBreakDelay = () =>
  randomDelay(config.BREAK_MIN_MS, config.BREAK_MAX_MS);

const humanTypingDelay = () =>
  randomDelay(60, 140);

module.exports = {
  sleep,
  randomDelay,
  postUnlikeDelay,
  afterScrollDelay,
  longBreakDelay,
  humanTypingDelay
};
