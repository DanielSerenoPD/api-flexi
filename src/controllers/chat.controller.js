var Parse = require("parse/node");
var Message = Parse.Object.extend("Message");
var Employee = Parse.Object.extend("Directory");


module.exports = {
    getMessages: async(req, res, next)=>{
        try{
        var queryDirectory = new Parse.Query(Employee)
        queryDirectory.equalTo('nominaId',req.params.id)
        let employee = await queryDirectory.find();
        var queryMessage = new Parse.Query(Message);
        queryMessage.equalTo('employeeId',employee[0]);
        let message = await queryMessage.find()
        return res.status(200).json({messages:message.length>0?message[0].get('messages'):[]});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    getPendingMessages: async(req, res, next)=>{
        try{
        // var queryDirectory = new Parse.Query(Employee)
        // queryDirectory.equalTo('nominaId',req.params.id)
        // let result = await queryDirectory.find();
        let employees = []
        // employee.id = item.id;
        // employee.nomina = item.get('nominaId');
        // employee.name = item.get('name');
        // employee.imageUrl = item.get('imageUrl');
        // employee.location = item.get('location');
        // employee.job = item.get('job');
        var queryMessage = new Parse.Query(Message);
        queryMessage.equalTo('status',true);
        queryMessage.include('Directory');
        let messages = await queryMessage.find()
        var queryDirectory = new Parse.Query(Employee)
        
        for(let item of messages){
            console.log(item.get('employeeId'))
        let id = item.get('employeeId');
        console.log(id.id)
        let result = await queryDirectory.get(id.id);
        let employee = {};
        employee.id = result.id;
        employee.nomina = result.get('nominaId');
        employee.name = result.get('name');
        employee.imageUrl = result.get('imageUrl');
        employee.location = result.get('location');
        employee.job = result.get('job');
        employees.push(employee);
        }
        return res.status(200).json({employees:employees});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    removeMessages: async(req, res, next)=>{
        try{
        console.log("hola aqui empiezo")
        console.log(req.body)
        var queryDirectory = new Parse.Query(Employee)
        queryDirectory.equalTo('nominaId',req.body.id)
        let employee = await queryDirectory.find();
        var queryMessage = new Parse.Query(Message);
        queryMessage.equalTo('employeeId',employee[0]);
        let message = await queryMessage.find()
        console.log(message)
        message[0].set("status",false)
        await message[0].save().then(item=>{
            item.set("status",false)
        })
        return res.status(200).json({messages:message.length>0?message[0].get('status'):[]});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    addMessage: async (req, res, next) => {
        console.log("mensa")
        console.log(req.body)
        var queryDirectory = new Parse.Query(Employee)
        queryDirectory.equalTo('nominaId',req.body.directoryId)
        let employee = await queryDirectory.find();
        console.log(employee[0])
        var queryMessage = new Parse.Query(Message)
        queryMessage.equalTo('employeeId',employee[0])
        let message = await queryMessage.find()
        console.log(message)
        if(message.length>0){
        let data = message[0].get("messages");
        data?data.push({rol:req.body.rol?req.body.rol:"user", content: req.body.content, messageDate: new Date()})
            :[{rol:req.body.rol?req.body.rol:"user", content: req.body.content, messageDate: new Date()}];
        message[0].set("messages", data)
        await message[0].save()
    }else{
        let message = new Message();
        message.set("employeeId",employee[0]);
        message.set('messages',[{rol:req.body.rol?req.body.rol:"user", content: req.body.content, messageDate: new Date()}]);
        await message.save();
    }
        res.status(200).json({message:{rol:req.body.rol?req.body.rol:"user", content: req.body.content, messageDate: new Date()}})
    }
}



