var Parse = require("parse/node");
var Message = Parse.Object.extend("Service");
var Service = Parse.Object.extend("Reservations");


module.exports = {
    getServices: async(req, res, next)=>{
        console.log("Service")
        try{
            
        let search = req.query.search ? req.query.search: '';
        let contains = req.query.contains ? req.query.contains: '';
        let skip = req.query.skip ? req.query.skip: 0;
        var query = new Parse.Query(Service)
        //query.skip(options && !!options.skip ? options.skip : 0);
        if(search !== ''){
            console.log("search")
            query.equalTo('type',search.toUpperCase());
        }else if(contains!==''){
            console.log("contains")
            query.startsWith("type", contains.toUpperCase());
            query.limit(10000);
        }else{
            console.log("else")
            if(skip>0){
                query.skip(skip>1?(skip*100)-100:100);
            }
            query.limit(10000);
        }
        query.include('userPointer','eventPointer','plantaPointer','activityPointer')
        let results = await query.find();
        console.log("Data:"+results.length)
        let services = []
        let aux = "";
        for(let item of results){
            let service = {};
            service.id = item.id
            service.nomina = (item.get('userPointer')).get('nomina')
            service.name = (item.get('userPointer')).get('name')
            service.aula = item.get('aula') ? item.get('aula'): '';
            service.eventName = item.get('eventPointer')?(item.get('eventPointer')).get('name'):''
            service.eventPlace = item.get('eventPointer')?(item.get('eventPointer')).get('place'):''
            service.eventDate = item.get('eventPointer')?(item.get('eventPointer')).get('date'):''
            service.plantaName = item.get('plantaPointer')?(item.get('plantaPointer')).get('name'):''
            service.activityName = item.get('activityPointer')?(item.get('activityPointer')).get('name'):''
            console.log(item.get('eventPointer')&&(item.get('eventPointer')).get('name'))
            services.push(service)
    }
    
    return res.status(200).json({services:services});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    createService: async(req, res, next)=>{
        try{
            let Service = new Service();
            let res = await Service.save(req.body)
        return res.status(200).json({Service:res});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    updateService: async(req, res, next)=>{
        console.log(req.body)
        try{
        var query = new Parse.Query(Service)
      
        let result = await query.get(req.body.id);
        let Service = result
       await Service.save(req.body);
        return res.status(200).json({Service:Service});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    deleteService: async(req, res, next)=>{
        console.log(req.body)
       
        try{
        var query = new Parse.Query(Service)
       
        let result = await query.get(req.body.id);
        let service = result
       await service.destroy();
        return res.status(200).json({service:service});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    
}



