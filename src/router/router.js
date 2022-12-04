const express = require('express');
const app = express.Router();
const TeacherController = require('./../controller/TeacherController');

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/contact',(req,res)=>{
    res.render('contact');
});

app.get('/regtec',(req,res)=>{
    res.render('teacherReg',{
        sendStatus:"false"
    });
}); 

app.get('/regstu',(req,res)=>{
    res.render('studentReg');
});

app.post('/sendteacherdata',TeacherController.sendDataAPI);

module.exports = app;