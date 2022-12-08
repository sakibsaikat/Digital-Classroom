const mongo = require('mongoose');

let TeacherCollection = new mongo.Schema({
    teacher_id:{
        type:String
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    profile:{
        type:String
    },
    status:{
        type:String,
        required:true
    }

});

let teacherModel = mongo.model('teachers',TeacherCollection);
module.exports = teacherModel;