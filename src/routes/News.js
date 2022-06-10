const express = require('express');
const router = express();
const newsController = require('../controllers/news.controller');
router.get('/',newsController.getNews)
router.post('/',newsController.createNews)
router.post('/update',newsController.updateNews)
router.post('/delete',newsController.deleteNews)
module.exports = router;