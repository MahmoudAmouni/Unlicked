const express = require('express');
const sessionController = require('../controllers/session');

const router = express.Router();

router.post('/start', sessionController.start);
router.post('/stop', sessionController.stop);
router.post('/resume', sessionController.resume);
router.get('/status', sessionController.status);
router.get('/progress', sessionController.getProgress);
router.post('/clear', sessionController.resetProgress);

module.exports = router;
