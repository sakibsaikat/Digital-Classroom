const mongo = require('mongoose');

let classSchema = new mongo.Schema({
    room_no:{
        type:String,
        required:true
    },
    teacher_id:{
        type:String,
        required:true
    },
    student_id:{
        type:String,
        required:true
    },
    status:{
        type:String
    }

});

const classmodel = mongo.model('class_detail',classSchema);
module.exports=classmodel;