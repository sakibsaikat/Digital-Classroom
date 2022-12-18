const express = require('express');
const app = express.Router();
const {v4:uuid} = require('uuid');


app.get('/',(req,res)=>{
    res.redirect(`/${uuid()}`);
});

app.get('/:roomId',(req,res)=>{
    res.render('room',{
        roomId:req.params.roomId
    });
});



module.exports = app;