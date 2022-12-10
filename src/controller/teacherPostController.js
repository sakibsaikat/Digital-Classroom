const mongo = require('express');
const session = require('express-session');
const PostModel = require('./../model/teacherPostModel');
let CountModel = require('./../model/countModel');


exports.sendDataAPI = async (req,res)=>{

    try{

        const {room_no,teacher_id,post_content}= req.body;

        let dt = new Date();
        let d = dt.toString();
        let hour = parseInt(d.substring(16,18));
        let min = d.substring(19,21);
        let ap = "AM";

        if(hour>12){
            hour-=12;
            ap="PM";
        }

        let post_time = hour.toString()+":"+min+" "+ap;


        let countObj = await CountModel.find();

        countObj.forEach(function(val){
            sid=val._id;
            postCount=val.post;
        });
    
        const p_count = (parseInt(postCount)+1).toString();
    
        const post_id = `NUB-P-${p_count}`;
        
    
        let updateCount = await CountModel.findByIdAndUpdate({_id:sid},{post:p_count});



        let postdata =await new PostModel({
            room_no,teacher_id,post_content,post_time,post_id
        }).save();

        res.redirect('/tpost/'+room_no+'/'+teacher_id);

    }catch(err){
        console.log(err);
    }

    
}