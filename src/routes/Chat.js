const express = require('express');
const router = express();
const chatController = require('../controllers/chat.controller');

router.post('/',chatController.saveFile);
module.exports = router;
