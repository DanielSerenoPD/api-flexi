const express = require('express');
const router = express();
const eventsController = require('../controllers/events.controller');
router.get('/',eventsController.getEvents)
router.get('/multimedia',eventsController.getMultimedia)
router.post('/multimedia',eventsController.addMultimedia)
router.post('/',eventsController.createEvent)
router.post('/update',eventsController.updateEvent)
/router.post('/delete',eventsController.deleteEvent)
module.exports = router;