var Parse = require("parse/node");
var User = Parse.Object.extend("User");


module.exports = {
    upload: async(req, res, next)=>{
        try{
            console.log("soy upload",req.file)
        return res.status(200).json({name:req.file.originalname})
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    }
    
}



