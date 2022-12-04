const mongo = require('mongoose');

mongo.connect('mongodb://0.0.0.0:27017/digital-room',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(()=>{
    console.log("DATABASE CONNECTED");

}).catch((err)=>{
    console.log(err);
});

