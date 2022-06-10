var Parse = require("parse/node");
var Message = Parse.Object.extend("News");
var News = Parse.Object.extend("News");
const fs = require("fs");
var { ruta } = require("../../Path.js");
const path = require("path");
module.exports = {
    getNews: async(req, res, next)=>{
        try{
        let search = req.query.search ? req.query.search: '';
        let contains = req.query.contains ? req.query.contains: '';
        let skip = req.query.skip ? req.query.skip: 0;
        var query = new Parse.Query(News)
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
        let news = []
        let aux = "";
        for(let item of results){
        let newItem = {}
        newItem.id = item.id;
        newItem.name = item.get('name');
        newItem.body = item.get('body');
        newItem.author = item.get('author');
        newItem.date = item.get('date');
        console.log(item.get('date'))
        newItem.userLikes = item.get('userLikes').length;
        newItem.userDislikes = item.get('userDislikes').length;
        newItem.image = item.get('previewImage')?item.get('previewImage').url():'';
        newItem.filters = JSON.stringify(item.get('filters'));
        news.push(newItem);
    }
    return res.status(200).json({news:news});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    createNews: async(req, res, next)=>{
       
        try{
            console.log(req.body)

             req.body.userLikes = []
             req.body.userDislikes = [];
            if(req.body.previewImage){
            let pathImage = req.body.previewImage;
            let file = fs.readFileSync(
                path.join(ruta + "/uploads/", req.body.previewImage)
              );
               if(file){
                var encode_image = new Buffer(file).toString('base64');
 const fileP = new Parse.File(pathImage, { base64: encode_image })
            req.body.previewImage = fileP;
            fs.unlinkSync(
                path.join(ruta + "/uploads/", pathImage)
              );}}
              req.body.date = new Date(req.body.date)
              let news = new News();
              let result = await news.save(req.body)
       return res.status(200).json({news:result});
       
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    updateNews: async(req, res, next)=>{
        console.log(req.body)
        try{
            if(req.body.imagePreview){
                console.log("mira")
                let pathImage = req.body.imagePreview;
                  if(fs.existsSync(path.join(ruta + "/uploads/", req.body.previewImage))){
                      console.log("miro")
                    let file = fs.readFileSync(
                        path.join(ruta + "/uploads/", req.body.previewImage)
                      );
                    var encode_image = new Buffer(file).toString('base64');
     const fileP = new Parse.File(pathImage, { base64: encode_image })
                req.body.previewImage = fileP;
                fs.unlinkSync(
                    path.join(ruta + "/uploads/", pathImage)
                  );}else{
                      console.log("que paso")
                      delete req.body.previewImage
                  }
            }else{
                console.log("queremos la champions")
                delete req.body.previewImage
            }
            req.body.date ? req.body.date = new Date(req.body.date):null;
        var query = new Parse.Query(News)
        //query.equalTo('nominaId',req.body.nomina)
        let result = await query.get(req.body.id);
        let news = result
       await news.save(req.body);
        return res.status(200).json({news:news});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    deleteNews: async(req, res, next)=>{
        console.log("xoy delete back")
        console.log(req.body)
        try{
        var query = new Parse.Query(News)
     
        let result = await query.get(req.body.id)
        let news = result
       await news.destroy();
        return res.status(200).json({news:news});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    
}



