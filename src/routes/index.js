const { Router } = require('express');
const router = Router();
const routesChat = require('./Chat');
const routesDirectory = require('./Directory')
const routesLearning = require('./Learning')
const routesFeedback = require('./Feedback')
const routesPassword = require('./Password')
const routesImage= require('./Image')
var multer = require('multer');
//var fileUpload = require("express-fileupload");
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
router.use('/feedback',upload.single('file'), routesFeedback);
router.use('/password',upload.single('file'), routesPassword);
router.use('/upload',upload.single('file'), routesImage);


module.exports = router;
