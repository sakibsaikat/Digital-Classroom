const mongo = require('mongoose');
const session = require('express-session');
const ClassDetailsModel = require('./../model/classDetailsModel');
const RoomModel = require('./../model/roomModel');

exports.sendDataAPI = async (req,res)=>{


    let roomInfo = await RoomModel.find({room_no:req.body.room_no});
    roomInfo.forEach(function(val){
        console.log(val.teacher_id);
        teacher_id = val.teacher_id;
        
    });

    room_no = req.body.room_no;
    student_id = req.body.student_id;

    if(roomInfo){
    
        let cldata = await new ClassDetailsModel({
            room_no,student_id,teacher_id
        }).save();
        res.send("ok");

    }else{
        res.send("No Room Found");
    }

   
}