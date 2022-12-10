const mongo = require('mongoose');
const RoomModel = require('./../model/roomModel');
const CountModel = require('./../model/countModel');
const session = require('express-session');


exports.sendDataAPI = async (req,res)=>{
    const {course_title,course_code,semester,section,weekdays,class_start_time,class_end_time} = req.body;

    let countObj = await CountModel.find();

    countObj.forEach(function(val){
        id=val._id;
        roomCount=val.room;
    });

    let r_count = (parseInt(roomCount)+1).toString();

    let teacher_id =req.session.userID; 

    const room_no = `ROOM_${teacher_id}_${r_count}`;
    
    let updateCount = await CountModel.findByIdAndUpdate({_id:id},{room:r_count});


    let roomdata =await new RoomModel({
        room_no,teacher_id,course_title,course_code,semester,section,weekdays,class_start_time,class_end_time
    }).save();

    res.send("ok");

    
}



exports.joinRoom = async (req,res)=>{

}