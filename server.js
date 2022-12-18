
const express = require('express');
const multer = require('multer');
const session = require('express-session');
const cookie = require('cookie-parser');
const app = express();
const port = 4500;

require('./src/db/conn');

app.use(express.urlencoded());
app.use(express.json());

app.use(express.static('public'));
app.set('view engine','ejs');
app.use('/',require('./src/router/router'));




app.listen(port,(err)=>{
    if(!err){
        console.log(`Server is listening at PORT: ${port}`);
    }
    else{
        console.log(err);
    }
});


