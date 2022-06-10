var Parse = require("parse/node");
var Filter = Parse.Object.extend("Filter");
var { ruta } = require("../../Path.js");
const path = require("path");
var fs = require('fs')
var xlsx = require('xlsx')
module.exports = {
    getFilters: async(req, res, next)=>{
        try{
            let filters = [];
            var query = new Parse.Query(Filter)
            let filterRes = await query.find();
            //query.equalTo('name',req.body.name)
            for(let item of filterRes){
                filters.push(item.get('filters'))
            }
                let names = {}
                let i = 0;
                for(let items of filters){
                 items.forEach(item=>{
                     let category = '';
                     if(i===2){
                         category = "planta"
                     }else if(i===1){
                        category = "segmentoPoblacion"
                     }else{
                        category = "razonSocial"
                     }
                   names[item.normalize("NFD").replace(/[\u0300-\u036f\-\.\" "]/g, "")] = {category:category, value:item, status: false};
                 })
                 i++;
                }
            return res.status(200).json({filters:filters,names:names});
            }
            catch(e){
                console.log(e)
                return res.status(400).json({filters:e});
            }
        },
        import: async (req,res)=>{
            
            try{
                if(fs.existsSync(path.join(ruta + "/uploads/", "EmployeeData Limpio.xlsx"))){
                const excel = xlsx.readFile(path.join(ruta + "/uploads/", "EmployeeData Limpio.xlsx"));
                const sheetNames = excel.SheetNames;
                const totalSheets = sheetNames.length;
                let parsedData = [];
            for (let i = 0; i < totalSheets; i++) {
                const tempData = xlsx.utils.sheet_to_json(excel.Sheets[sheetNames[i]]);
                tempData.shift();
                parsedData.push(...tempData);
            }
            fs.unlinkSync(path.join(ruta + "/uploads/", "EmployeeData Limpio.xlsx"));
            var query = new Parse.Query(Filter)
            let i = 0;
            let segmentoP = [];
            let razonR = [];
            let planta = [];
            for(let item of parsedData){
               
                item.segmentopoblacion&&segmentoP.push(item.segmentopoblacion)
                item.planta&&planta.push(item.planta)
                item.razonsocial&&razonR.push(item.razonsocial)
            }
            let filter = new Filter();
            filter.set("name",'razonSocial');
            filter.set('filters',razonR);
            await filter.save();
            let filter2 = new Filter();
            filter2.set("name",'segmentoPoblacional');
            filter2.set('filters',segmentoP);
            await filter2.save();
            let filter3 = new Filter();
            filter3.set("name",'planta');
            filter3.set('filters',planta);
            await filter3.save();
            console.log("Directorio actualizado correctamente.")
            }else{
                console.log("El directorio ya estaba actualizado.")
            }
            
            return res.status(200).json("hola");
            }catch(e){
                console.log(e)
                return false;
            }
          }
}



