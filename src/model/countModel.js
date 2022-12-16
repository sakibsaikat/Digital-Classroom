const mongo = require('mongoose');

let CountCollection = new mongo.Schema({

    teacher:{
        type:String,
        required:true,
        default:"0"
    },
    student:{
        type:String,
        require:true,
        default:"0"
    },
    room:{
        type:String,
        require:true,
        default:"0"
    },
    post:{
        type:String,
        require:true,
        default:"0"
    },

    status:{
        type:String,
        required:true
    }

});

let countModel = mongo.model('count',CountCollection);
module.exports = countModel;