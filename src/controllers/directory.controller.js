var Parse = require("parse/node");
var Message = Parse.Object.extend("Message");
var Employee = Parse.Object.extend("Directory");


module.exports = {
    getEmployees: async(req, res, next)=>{
        try{
        let search = req.query.search ? req.query.search: '';
        let contains = req.query.contains ? req.query.contains: '';
        let skip = req.query.skip ? req.query.skip: 0;
        var queryDirectory = new Parse.Query(Employee)
        //queryDirectory.skip(options && !!options.skip ? options.skip : 0);
        if(search !== ''){
            console.log("search")
            queryDirectory.equalTo('name',search.toUpperCase());
        }else if(contains!==''){
            console.log("contains")
            queryDirectory.startsWith("name", contains.toUpperCase());
            queryDirectory.limit(10000);
        }else{
            console.log("else")
            if(skip>0){
                queryDirectory.skip(skip>1?(skip*100)-100:100);
            }
            queryDirectory.limit(10000);
        }
        let results = await queryDirectory.find();
        console.log("Data:"+results.length)
        let employees = []
        for(let item of results){
        let employee = {}
        employee.id = item.id;
        employee.nomina = item.get('nominaId');
        employee.job = item.get('job');
        employee.name = item.get('name');
        employee.location = item.get('location');
        employee.companyEmail = item.get('companyEmail');
        employee.personalEmail = item.get('personalEmail');
        employee.companyPhone = item.get('companyPhone');
        employee.personalPhone = item.get('personalPhone');
        employee.extension = item.get('extension');
        employee.retired = item.get('retired');
        employee.status = item.get('status');
        employee.imageUrl = item.get('imageUrl');
        employee.razonSocial = item.get('razonSocial');
        employee.segmentoPoblacion = item.get('segmentoPoblacion');
        employee.planta = item.get('planta');
        employees.push(employee);
    }
    console.log("Data 2: "+employees.length)
    return res.status(200).json({employees:employees});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    updateEmployee: async(req, res, next)=>{
        console.log(req.body)
        return res.status(200);
    //     try{
    //     var queryDirectory = new Parse.Query(Employee)
    //     queryDirectory.equalTo('nominaId',req.body.nomina)
    //     let result = await queryDirectory.find();
    //     let employee = result[0]
    //    await employee.save(req.body);
    //     return res.status(200).json({employee:employee});
    //     }
    //     catch(e){
    //         console.log(e)
    //         return res.status(400).json({messages:e});
    //     }
       
    },
    deleteEmployee: async(req, res, next)=>{
        console.log(req.body)
        return res.status(200);
    //     try{
    //     var queryDirectory = new Parse.Query(Employee)
    //     queryDirectory.equalTo('nominaId',req.body.nomina)
    //     let result = await queryDirectory.find();
    //     let employee = result[0]
    //    await employee.destroy();
    //    console.log("Destroy: "+employee)
    //     return res.status(200).json({employee:employee});
    //     }
    //     catch(e){
    //         console.log(e)
    //         return res.status(400).json({messages:e});
    //     }
       
    },
    getEmployee: async(req, res, next)=>{
        try{
        var queryDirectory = new Parse.Query(Employee)
        queryDirectory.equalTo('nominaId',req.params.id)
        let result = await queryDirectory.find();
        let employee = {}
        employee.id = result[0].id;
        employee.nomina = result[0].get('nominaId');
        employee.name = result[0].get('name');
        employee.imageUrl = result[0].get('imageUrl');
        employee.location = result[0].get('location');
        employee.job = result[0].get('job');
        employee.razonSocial =  result[0].get('razonSocial');
        employee.segmentoPoblacion =  result[0].get('segmentoPoblacion');
        employee.planta =  result[0].get('planta');
        return res.status(200).json({employee:employee});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    
}



