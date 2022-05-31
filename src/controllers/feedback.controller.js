var Parse = require("parse/node");
var Message = Parse.Object.extend("Feedback");
var Feedback = Parse.Object.extend("Feedback");


module.exports = {
    getFeedbacks: async(req, res, next)=>{
        try{
            console.log("Feed")
        let search = req.query.search ? req.query.search: '';
        let contains = req.query.contains ? req.query.contains: '';
        let skip = req.query.skip ? req.query.skip: 0;
        var query = new Parse.Query(Feedback)
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
        query.include('userPointer')
        let results = await query.find();
        console.log("Data:"+results.length)
        let feedbacks = []
        let aux = "";
        for(let item of results){
        let feedback = {}
        feedback.id = item.id;
        aux = item.get('userPointer');
        feedback.userPointer = aux ? aux.get('nomina'):'';
        feedback.body = item.get('body');
        feedback.type = item.get('type');
        feedbacks.push(feedback);
    }
    console.log("Data 2: "+feedbacks.length)
    return res.status(200).json({feedback:feedbacks});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    createFeedback: async(req, res, next)=>{
        try{
            let feedback = new Feedback();
            let res = await feedback.save(req.body)
        return res.status(200).json({feedback:res});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    updateFeedback: async(req, res, next)=>{
        console.log(req.body)
        try{
        var query = new Parse.Query(Feedback)
      
        let result = await query.get(req.body.id);
        let feedback = result
       await feedback.save(req.body);
        return res.status(200).json({feedback:feedback});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    deleteFeedback: async(req, res, next)=>{
        console.log(req.body)
       
        try{
        var query = new Parse.Query(Feedback)
       
        let result = await query.get(req.body.id);
        let feedback = result
       await feedback.destroy();
        return res.status(200).json({feedback:feedback});
        }
        catch(e){
            console.log(e)
            return res.status(400).json({messages:e});
        }
       
    },
    
}



