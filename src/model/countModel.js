const mongo = require('mongoose');

let CountCollection = new mongo.Schema({

    teacher:{
        type:String,
        required:true
    },
    student:{
        type:String,
        require:true
    },

    status:{
        type:String,
        required:true
    }

});

let countModel = mongo.model('count',CountCollection);
module.exports = countModel;