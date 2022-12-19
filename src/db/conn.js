const mongo = require('mongoose');

mongo.connect('mongodb+srv://sakibsaikat1438:saikat6049@cluster0.tqmh0r3.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(()=>{
    console.log("DATABASE CONNECTED");

}).catch((err)=>{
    console.log(err);
});




// mongo.connect('mongodb://0.0.0.0:27017/digital-room',{
//     useNewUrlParser: true, 
//     useUnifiedTopology: true
// }).then(()=>{
//     console.log("DATABASE CONNECTED");

// }).catch((err)=>{
//     console.log(err);
// });


