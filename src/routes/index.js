const { Router } = require('express');
const router = Router();
const routesChat = require('./Chat')
var multer = require('multer');
//var fileUpload = require("express-fileupload");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    cb(null, file.fieldname+ext)
  }
})
 
var upload = multer({ storage: storage })
router.use('/chat',upload.single('file'), routesChat);
module.exports = router;
