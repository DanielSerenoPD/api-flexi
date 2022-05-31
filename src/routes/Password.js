const express = require('express');
const router = express();
const passwordController = require('../controllers/password.controller');
router.post('/',passwordController.updatePassword)
module.exports = router;