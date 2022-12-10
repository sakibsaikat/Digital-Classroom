const mongo = require('mongoose');

let CommentCollection = new mongo.Schema({

    room_no:{
        type:String,
        required:true
    },
    post_id:{
        type:String,
        require:true
    },
    teacher_id:{
        type:String,
        required:true
    },
    cname:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    }

});

let CommentModel = mongo.model('comment',CommentCollection);
module.exports = CommentModel;