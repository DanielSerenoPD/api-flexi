var Parse = require("parse/node");
var Comment = Parse.Object.extend("Videos");
module.exports = {
    getMessages: async(req, res, next)=>{
        var comment = new Parse.Query(Comment);
        console.log(await comment.find())
       return res.status(200).json({message:"hola"});
    },
    saveFile: async (req, res, next) => {
        console.log(req.file);
        let ext = req.file.originalname.substring(
          req.file.originalname.lastIndexOf("."),
          req.file.originalname.length
        )
    },
}