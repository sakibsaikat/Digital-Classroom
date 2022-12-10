const mongo = require('mongoose');

let roomSchema = new mongo.Schema({
    room_no:{
        type:String,
        required:true
    },
    teacher_id:{
        type:String,
        required:true
    },
    course_title:{
        type:String,
        required:true
    },
    course_code:{
        type:String,
        required:true
    },
    semester:{
        type:String,
        required:true
    },
    section:{
        type:String,
        required:true
    },
    weekdays:{
        type:String,
        required:true
    },
    class_start_time:{
        type:String,
        required:true
    },
    class_end_time:{
        type:String,
        required:true
    },
    status:{
        type:String
    }

});

const roommodel = mongo.model('class_room',roomSchema);
module.exports=roommodel;