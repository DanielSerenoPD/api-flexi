var Parse = require("parse/node");
var Message = Parse.Object.extend("Message");
var Employee = Parse.Object.extend("Directory");
const fs = require("fs");
var { ruta } = require("../../Path.js");
const path = require("path");
const xlsx = require("xlsx");

module.exports = {
    getMessages: async(req, res, next)=>{
        var queryDirectory = new Parse.Query(Employee)
        let employee = await queryDirectory.get(req.body.directoryId);
        var queryMessage = new Parse.Query(Message);
        queryMessage.equalTo('employeeId',employee);
        let message = await queryMessage.find()
        console.log(message[0].get('messages'))
       return res.status(200).json(message[0].get('messages'));
    },
    addMessage: async (req, res, next) => {
        var queryDirectory = new Parse.Query(Employee)
        let employee = await queryDirectory.get(req.body.directoryId);
        console.log(employee)
        var queryMessage = new Parse.Query(Message)
        queryMessage.equalTo('employeeId',employee)
        let message = await queryMessage.find()
        if(message.length>0){
        let data = message[0].get("messages");
        data?data.push({rol:req.body.rol?req.body.rol:"user", content: req.body.content, messageDate: new Date()})
            :[{rol:req.body.rol?req.body.rol:"user", content: req.body.content, messageDate: new Date()}];
        message[0].set("messages", data)
        await message[0].save()
    }else{
        let message = new Message();
        message.set("employeeId",employee);
        message.set('messages',[{rol:req.body.rol?req.body.rol:"user", content: req.body.content, messageDate: new Date()}]);
        await message.save();
    }
        res.status(200).json({message:"mensaje enviado exitosamente."})
    },
    saveFile: async (req, res, next) => {
        try{
        const excel = xlsx.readFile(path.join(ruta + "/uploads/", "file"));
        const sheetNames = excel.SheetNames;
        const totalSheets = sheetNames.length;
        let parsedData = [];
    for (let i = 0; i < totalSheets; i++) {
        const tempData = xlsx.utils.sheet_to_json(excel.Sheets[sheetNames[i]]);
        tempData.shift();
        parsedData.push(...tempData);
    }
    var employeeQuery = new Parse.Query(Employee)
    for(let i = 0; i<parsedData.length; i++){
    let item = parsedData[i];
    employeeQuery.equalTo('nomina',+item.nomina);
    let result = await employeeQuery.find();
    console.log("aqui");
    let isSave = null
    if(result.length>0){
        let employeeUpdate = result[0];
        employeeUpdate.save()
        .then(employee=>{
            employee.set("nominaId",""+item.nomina);
            employee.set("nomina",+item.nomina);
            employee.set("name",item.nombre);
            employee.set("job",item.puesto);
            employee.set("location",item.ubicacion);
            employee.set("companyEmail",item.email);
            employee.set("companyPhone",""+item.telefono)
            employee.set("personalPhone",""+item.telefonopersonal);
            employee.set("extension",""+item.extension);
            employee.set("status",item.status === "ACTIVE"?true:false);
            employee.set("retired",item.jubilado == "x"?true:false);
            employee.set("personalEmail",item.emailpersonal);
            employee.set("imageUrl",item.foto);
            return employee.save();
        })
        console.log("existe"+i)
    }else{
        let employee = new Employee();
        isSave = await employee.save({
        nomina: +item.nomina,
        nominaId: ""+item.nomina,
        name: item.nombre,
        job: item.puesto,
        location: item.ubicacion,
        companyEmail: item.email,
        companyPhone: ""+item.telefono,
        extension: ""+item.extension,
        status: item.status === "ACTIVE"?true:false,
        retired: item.jubilado == "x"?true:false,
        personalEmail: item.emailpersonal,
        personalPhone: ""+item.telefonopersonal,
        imageUrl: item.foto
      });
      console.log("no existe" + i)
    }
    }
    return res.status(200).json({message:"exito."});
    }catch(error){
        return res.status(400).json({message:error});
    }
        
    },
}



