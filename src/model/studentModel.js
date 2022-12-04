const mongo = require('mongoose');

let StudnetCollection = new mongo.Schema({
    id:{
        type:String
    },
    name:{
        type:String,
        required:true
    },
    student_id:{
        type:String,
        require:true
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
    department:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }

});

let studentModel = mongo.model('student',StudnetCollection);
module.exports = studentModel;