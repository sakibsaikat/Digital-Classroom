const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express.Router();
const multer = require('multer');
const TeacherController = require('./../controller/TeacherController');
const StudentController = require('./../controller/StudentController');


app.use(session({
    secret:"ThisIsARandomSecret",
    resave:true,
    saveUninitialized:true,
    cookie:{
        maxAge:100*60*60*24
    }
}));

const redirectDash = (req,res,next)=>{
    if(req.session.userID){
        res.redirect('/sdash');
    }else{
        next();
    }
}

const redirectLogin=(req,res,next)=>{
    if(!req.session.userID){
        res.redirect('/slogin');
    }
    else{
        next();
    }
}

const DESTINATION_FOLDER = path.join('./public/uploads');

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,DESTINATION_FOLDER);
    },
    filename:(req,file,cb)=>{
        //console.log(file);
        cb(null,req.params.id+path.extname(file.originalname));
    }
});

const upload = multer({storage:storage});



//Homepage Route Section
app.get('/',(req,res)=>{
    res.render('index');
});



//Registration Route Section
app.get('/regtec',(req,res)=>{
    res.render('teacherReg',{
        sendStatus:"false"
    });
}); 
app.get('/regstu',(req,res)=>{
    res.render('studentReg',{
        sendStatus:"false"
    });
});


//Admin Route Section
app.get('/admindash',(req,res)=>{
    res.render('Admin/admindashboard');
});
app.get('/admindash/teacher',(req,res)=>{
    res.render('Admin/teachers');
});
app.get('/admindash/student',(req,res)=>{
    res.render('Admin/students');
});


//Student Dashboard

app.get('/slogin',redirectDash,(req,res)=>{
        res.render('Student/slogin');

});

app.post('/slogin',(req,res)=>{
    if(!req.session.userID){

        if(req.body.email=="zayed@gmail.com" && req.body.password=="123"){
            req.session.userID="NUB1";
            res.redirect('/sdash');
        }
        else{
            console.log("Sorry!");
        }
        
    }
    res.render('Student/slogin');

    
});


app.get('/sdash',redirectLogin,(req,res)=>{
    
    if(!req.session.userID){
        req.session.userID="NUB1";
    }

    resrender('Student/studentdashboard',{
        userID:req.session.userID
    });
    
    
});


app.post('/upimg/:id',upload.single("profile"),(req,res)=>{
    res.send("Image Uploaded");
});


//Teacher Dashboard
app.get('/tlogin',(req,res)=>{
    res.render('Teacher/tlogin');
});
app.get('/tdash',(req,res)=>{
    res.render('Teacher/teacherdashboard');
});

//Logout route
app.get('/logout',(req,res)=>{
    if(req.session.userID){
        req.session.destroy();
    }
    res.redirect('/slogin');
})



// Teachers DATA Controller API
app.post('/sendteacherdata',TeacherController.sendDataAPI);


//Student DATA Controller API
app.post('/sendstudentdata',StudentController.sendDataAPI);

module.exports = app;