const mongo = require('mongoose');

let PostCollection = new mongo.Schema({

    room_no:{
        type:String,
        required:true
    },
    teacher_id:{
        type:String,
        required:true
    },
    post_id:{
        type:String,
        required:true
    },
    post_time:{
        type:String
    },
    post_content:{
        type:String,
        required:true
    },
    image:{
        type:String
    }
  

});

let PostModel = mongo.model('teacher_post',PostCollection);
module.exports = PostModel;