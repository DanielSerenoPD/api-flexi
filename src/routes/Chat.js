const express = require('express');
const router = express();
const chatController = require('../controllers/chat.controller');
router.post('/',chatController.addMessage);
router.get('/',chatController.getMessages)
module.exports = router;
