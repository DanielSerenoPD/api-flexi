const express = require('express');
const router = express();
const imageController = require('../controllers/image.controller');
router.post('/',imageController.upload)
module.exports = router;