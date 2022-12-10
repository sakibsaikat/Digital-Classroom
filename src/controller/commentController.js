const mongo = require("mongoose");
const session = require('express-session');
let CommentModel = require('./../model/commentModel');

exports.sendDataAPI = async (req,res)=>{
    try{
        const {room_no,post_id,teacher_id,comment,cname} = req.body;
        let dt = new Date();
        let d = dt.toString();
        let hour = parseInt(d.substring(16,18));
        let min = d.substring(19,21);
        let ap = "AM";

        if(hour>12){
            hour-=12;
            ap="PM";
        }

        let time = hour.toString()+":"+min+" "+ap;

        let cmntdata = await new CommentModel({
            room_no,teacher_id,comment,cname,time,post_id
        }).save();

        res.redirect('/tpost/'+room_no+'/'+teacher_id);

    }catch(err){
        console.log(err);
    }
}

exports.sendStDataAPI = async (req,res)=>{
    try{
        const {room_no,post_id,teacher_id,comment,cname,student_id} = req.body;
        let dt = new Date();
        let d = dt.toString();
        let hour = parseInt(d.substring(16,18));
        let min = d.substring(19,21);
        let ap = "AM";

        if(hour>12){
            hour-=12;
            ap="PM";
        }

        let time = hour.toString()+":"+min+" "+ap;

        let cmntdata = await new CommentModel({
            room_no,teacher_id,comment,cname,time,post_id
        }).save();

        res.redirect('/spost/'+room_no+'/'+teacher_id+'/'+student_id);

    }catch(err){
        console.log(err);
    }
}