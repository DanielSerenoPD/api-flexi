var Parse = require("parse/node");
var Comment = Parse.Object.extend("Videos");
var Employee = Parse.Object.extend("Employee");
const fs = require("fs");
var { ruta } = require("../../Path.js");
const path = require("path");
const xlsx = require("xlsx");

module.exports = {
    getMessages: async(req, res, next)=>{
        var comment = new Parse.Query(Comment);
        console.log(await comment.find())
       return res.status(200).json({message:"hola"});
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
 var employeeQuery = new Parse.Query(Employee);
    for(let i = 0; i<parsedData.length; i++){
        let item = parsedData[i];
        employeeQuery.equalTo('nomina',""+item.nomina);
        let result = await employeeQuery.find();
        let isSave = null
        console.log(result)
        if(result.length>0){
            let employeeUpdate = result[0];
            employeeUpdate.save()
            .then(employee=>{
                employee.set("nomina",""+item.nomina);
                employee.set("nombre",item.nombre);
                employee.set("puesto",item.puesto);
                employee.set("ubicacion",item.ubicacion);
                employee.set("email",item.email);
                employee.set("telefono",""+item.telefono);
                employee.set("extension",item.extension);
                employee.set("status",""+item.status);
                employee.set("jubilado",item.jubilado);
                employee.set("emailPersonal",item.emailpersonal);
                employee.set("telefonoPersonal",""+item.telefonopersonal);
                employee.set("foto",item.foto);
                return employee.save();
            })
            console.log("existe")
        }else{
            let employee = new Employee();
            isSave = await employee.save({
            nomina: ""+item.nomina,
            nombre: item.nombre,
            puesto: item.puesto,
            ubicacion: item.ubicacion,
            email: item.email,
            telefono: ""+item.telefono,
            extension: item.extension,
            status: ""+item.status,
            jubilado: item.jubilado,
            emailPersonal: item.emailpersonal,
            telefonoPersonal: ""+item.telefonopersonal,
            foto: item.foto
          });
          console.log("no existe")
        }
    }
        return res.status(200).json({message:"exito"});
    }catch(error){
        return res.status(400).json({message:error});
    }
        
    },
}