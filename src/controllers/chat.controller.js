var Parse = require("parse/node");
var Comment = Parse.Object.extend("Videos");
const fs = require("fs");
var { ruta } = require("../../Path.js");
const path = require("path");
const xlsxFile = require("read-excel-file/node");
module.exports = {
    getMessages: async(req, res, next)=>{
        var comment = new Parse.Query(Comment);
        console.log(await comment.find())
       return res.status(200).json({message:"hola"});
    },
    saveFile: async (req, res, next) => {
        console.log(req.file);
        const file = fs.readFileSync(
            path.join(ruta + "/uploads/", "file")
          );
          let excel = await xlsxFile(file);
          console.log(typeof excel)
        return res.status(200).json({message:"exito"});
        
    },
}