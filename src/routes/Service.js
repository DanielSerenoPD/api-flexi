const express = require('express');
const router = express();
const servicesController = require('../controllers/services.controller');
router.get('/',servicesController.getServices)
//router.post('/',servicesController.createservices)
router.post('/delete',servicesController.deleteService)
module.exports = router;