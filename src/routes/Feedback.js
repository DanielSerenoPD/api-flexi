const express = require('express');
const router = express();
const FeedbackController = require('../controllers/feedback.controller');
router.get('/',FeedbackController.getFeedbacks)
router.post('/',FeedbackController.createFeedback)
router.post('/delete',FeedbackController.deleteFeedback)
module.exports = router;