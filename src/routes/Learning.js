const express = require('express');
const router = express();
const learningController = require('../controllers/learning.controller');
router.get('/',learningController.getLearning)
router.post('/',learningController.createLearning)
router.post('/update',learningController.updateLearning)
router.post('/delete',learningController.deleteLearning)
module.exports = router;