var Parse = require("parse/node");
var User = Parse.Object.extend("User");


module.exports = {
    updatePassword: async(req, res, next)=>{
        try{
        let{ nomina, password} = req.body;
        var query = new Parse.Query(User)
        query.equalTo('nomina',nomina);
        let user = await query.find();
        if(user.length>0){
        console.log(user[0].get("password"))
        user[0].save({
            password:password
        })
        return res.status(200).json({password:password})
         }else{
            return res.status(400).json({message:"Usuario no encontrado"})
         }
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    }
    
}



