var { ruta } = require("../../Path.js");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
var Parse = require("parse/node");
var Employee = Parse.Object.extend("Directory");
module.exports = async function(){
    console.log("funcionara")
    try{
        console.log(fs.existsSync(path.join(ruta + "/uploads/", "file")))
        if(fs.existsSync(path.join(ruta + "/uploads/", "file"))){
        const excel = xlsx.readFile(path.join(ruta + "/uploads/", "file"));
        const sheetNames = excel.SheetNames;
        const totalSheets = sheetNames.length;
        let parsedData = [];
    for (let i = 0; i < totalSheets; i++) {
        const tempData = xlsx.utils.sheet_to_json(excel.Sheets[sheetNames[i]]);
        tempData.shift();
        parsedData.push(...tempData);
    }
    fs.unlinkSync(path.join(ruta + "/uploads/", "file"));
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
    
    console.log("Directorio actualizado correctamente.")
    }else{
        console.log("El directorio ya estaba actualizado.")
    }
    
    return true;
    }catch(error){
        console.log("Ha ocurrido un error actualizando el directorio.")
        return false;
    }
}