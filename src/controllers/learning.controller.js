var Parse = require("parse/node");
var Message = Parse.Object.extend("ELearning");
var ELearning = Parse.Object.extend("ELearning");
const fs = require("fs");
var { ruta } = require("../../Path.js");
const path = require("path");
module.exports = {
    getLearning: async(req, res, next)=>{
        try{
        let search = req.query.search ? req.query.search: '';
        let contains = req.query.contains ? req.query.contains: '';
        let skip = req.query.skip ? req.query.skip: 0;
        var query = new Parse.Query(ELearning)
        //query.skip(options && !!options.skip ? options.skip : 0);
        if(search !== ''){
            console.log("search")
            query.equalTo('nameCourse',search.toUpperCase());
        }else if(contains!==''){
            console.log("contains")
            query.startsWith("nameCourse", contains.toUpperCase());
            query.limit(10000);
        }else{
            console.log("else")
            if(skip>0){
                query.skip(skip>1?(skip*100)-100:100);
            }
            query.limit(10000);
        }
        let results = await query.find();
        console.log("Data:"+results.length)
        let learnings = []
        let aux = "";
        for(let item of results){
        let learning = {}
        learning.id = item.id;
        learning.nameCourse = item.get('nameCourse');
        learning.nameOrganization = item.get('nameOrganization');
        learning.date = item.get('date');
        learning.url = item.get('url')
        aux = JSON.stringify(item.get('imagePreview'));
        console.log(learning.imagePreview)
        learning.image = aux.split('url":"')[1];
        learning.image =  learning.image.substring(0,learning.image.length-2)
        
        
        learnings.push(learning);
    }
    console.log("Data 2: "+learnings.length)
    return res.status(200).json({learning:learnings});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    createLearning: async(req, res, next)=>{
       
        try{
            console.log(req.body)
            if(req.body.imagePreview){
            let pathImage = req.body.imagePreview;
            let file = fs.readFileSync(
                path.join(ruta + "/uploads/", req.body.imagePreview)
              );
               if(file){
                var encode_image = new Buffer(file).toString('base64');
 const fileP = new Parse.File(pathImage, { base64: encode_image })
            req.body.imagePreview = fileP;
            req.body.date = new Date(req.body.date)
            fs.unlinkSync(
                path.join(ruta + "/uploads/", pathImage)
              );}}
              let learning = new ELearning();
              let result = await learning.save(req.body)
       return res.status(200).json({learning:result});
       
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    updateLearning: async(req, res, next)=>{
        console.log(req.body)
        try{
            if(req.body.imagePreview){
                let pathImage = req.body.imagePreview;
                let file = fs.readFileSync(
                    path.join(ruta + "/uploads/", req.body.imagePreview)
                  );
                   if(file){
                    var encode_image = new Buffer(file).toString('base64');
     const fileP = new Parse.File(pathImage, { base64: encode_image })
                req.body.imagePreview = fileP;
                fs.unlinkSync(
                    path.join(ruta + "/uploads/", pathImage)
                  );}
            }
            req.body.date ? req.body.date = new Date(req.body.date):null;
        var query = new Parse.Query(ELearning)
        //query.equalTo('nominaId',req.body.nomina)
        let result = await query.get(req.body.id);
        let learning = result
       await learning.save(req.body);
        return res.status(200).json({learning:learning});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    deleteLearning: async(req, res, next)=>{
        console.log("xoy delete back")
        console.log(req.body)
        try{
        var query = new Parse.Query(ELearning)
     
        let result = await query.get(req.body.id)
        let learning = result
       await learning.destroy();
        return res.status(200).json({learning:learning});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    
}



