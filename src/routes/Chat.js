const express = require('express');
const router = express();
const chatController = require('../controllers/chat.controller');
router.post('/',chatController.addMessage);
router.get('/:id',chatController.getMessages)
router.get('/',chatController.getPendingMessages)
router.post('/remove',chatController.removeMessages)
module.exports = router;
