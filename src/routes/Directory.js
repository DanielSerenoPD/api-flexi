const express = require('express');
const router = express();
const directoryController = require('../controllers/directory.controller');
//router.post('/',chatController.addMessage);
router.get('/:id',directoryController.getEmployee)
router.get('/',directoryController.getEmployees)
router.post('/',directoryController.updateEmployee)
router.post('/delete',directoryController.deleteEmployee)
module.exports = router;