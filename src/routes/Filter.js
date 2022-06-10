const express = require('express');
const router = express();
const filterController = require('../controllers/filter.controller');
router.get('/',filterController.getFilters)
module.exports = router;