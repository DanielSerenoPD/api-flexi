var Parse = require("parse/node");
var Images = Parse.Object.extend("Images");
var Videos = Parse.Object.extend("Videos");
var Events = Parse.Object.extend("Events");
const fs = require("fs");
var { ruta } = require("../../Path.js");
const path = require("path");
module.exports = {
    getEvents: async(req, res, next)=>{
        try{
        let search = req.query.search ? req.query.search: '';
        let contains = req.query.contains ? req.query.contains: '';
        let skip = req.query.skip ? req.query.skip: 0;
        var query = new Parse.Query(Events)
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
        query.include('gallery','videos')
        let results = await query.find();
        let events = []
        
        for(let item of results){
            let event = {};
            event.id = item.id;
            event.name = item.get('name');
            event.body = item.get('body');
            event.place = item.get('place');
            event.date = item.get('date');
            event.usersReservations = item.get('userReservations')?JSON.stringify(item.get('userReservations')):'[]'
            event.previewImage = item.get('previewImage')?(item.get('previewImage')).url():''
            event.filters = JSON.stringify(item.get('filters'))
            events.push(event) 
    }
    return res.status(200).json({events:events});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    getMultimedia: async(req, res, next)=>{
        try{
        let id = req.query.id ? req.query.id: '';
        var query = new Parse.Query(Events)
        query.include('gallery','videos')
        let result = await query.get(id);
        let multimedia = []
       let queryRelation = result.relation('gallery')
       let resultImages = await (queryRelation.query()).find({json: true});
       resultImages.forEach(item =>{
            console.log(item.image.url)
            let obj = {}
            obj.id = item.id
            obj.type = 'img'
            obj.url = item.image.url
            multimedia.push(obj)

        })
    return res.status(200).json({multimedia:multimedia});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    createEvent: async(req, res, next)=>{
       
        try{
            console.log(req.body)
            if(req.body.previewImage){
                console.log("entre al condiional")
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
              let event = new Events();
              let result = await event.save(req.body)
       return res.status(200).json({event:result});
       
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    updateEvent: async(req, res, next)=>{
        console.log(req.body)
        try{
            if(req.body.previewImage){
                console.log("mira")
                let pathImage = req.body.previewImage;
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
        var query = new Parse.Query(Events)
        //query.equalTo('nominaId',req.body.nomina)
        let result = await query.get(req.body.id);
        let event = result
       await event.save(req.body);
        return res.status(200).json({event:event});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    deleteEvent: async(req, res, next)=>{
        console.log("xoy delete back")
        console.log(req.body)
        try{
        var query = new Parse.Query(Events)
     
        let result = await query.get(req.body.id)
        let event = result
       await event.destroy();
        return res.status(200).json({event:event});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    addMultimedia: async(req, res, next)=>{
        var query = new Parse.Query(Events)
     
        let event = await query.get(req.body.id)
        let relationImages = event.relation('Gallery')
        let relationVideos = event.relation('Videos')
        req.files&&req.files.forEach(async file=>{
            console.log(file.originalname)
            if(file.mimetype.includes('image')){
            let image = new Images();
    // const fileP = new Parse.File(file)

            await image.save({name:file.originalname}).then(res=>relationImages.add(res))
            
            }
            else{
                let video = new Videos();
                video.name = file.originalname
                var encode_image = new Buffer(file).toString('base64');
                const fileP = new Parse.File(pathImage, { base64: encode_image })
                video.video = fileP
                await video.save().then(res=>relationVideos.add(res))
                
            }
        })
    },
    
}



