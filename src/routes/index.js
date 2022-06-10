const { Router } = require('express');
const router = Router();
const routesChat = require('./Chat');
const routesDirectory = require('./Directory')
const routesLearning = require('./Learning')
const routesEvents = require('./Events')
const routesNews = require('./News')
const routesFeedback = require('./Feedback')
const routesService = require('./Service')
const routesPassword = require('./Filter')
const routesImage= require('./Image')
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    //let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    console.log(file)
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })
router.use('/chat',upload.single('file'), routesChat);
router.use('/directory',upload.single('file'), routesDirectory);
router.use('/learning',upload.single('file'), routesLearning);
router.use('/events',upload.array('file'), routesEvents);
router.use('/news',upload.single('file'), routesNews);
router.use('/feedback',upload.single('file'), routesFeedback);
router.use('/filters',upload.single('file'), routesPassword);
router.use('/upload',upload.single('file'), routesImage);
router.use('/services',upload.single('file'), routesService);



module.exports = router;
