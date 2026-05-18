const express = require('express');
const systemController = require('../controllers/system');

const router = express.Router();

router.get('/health', systemController.health);
router.get('/test-browser', systemController.testBrowser);
router.post('/test-unlike', systemController.testUnlike);
router.get('/test-ws', systemController.testWs);

module.exports = router;
