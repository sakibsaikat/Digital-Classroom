const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express.Router();
const multer = require('multer');
const studentmodel = require('./../model/studentModel');
const teachertmodel = require('./../model/teacherModel');
const TeacherController = require('./../controller/TeacherController');
const StudentController = require('./../controller/StudentController');
const CountController = require('./../controller/countController');


app.use(session({
    secret:"ThisIsARandomSecret",
    resave:true,
    saveUninitialized:true,
    cookie:{
        maxAge:100*60*60*24
    }
}));


// Middleware Section for Student Panel 
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
// Middleware Section for Teacher Panel 
const redirectTDash = (req,res,next)=>{
    if(req.session.userID){
        res.redirect('/tdash');
    }else{
        next();
    }
}

const redirectTLogin=(req,res,next)=>{
    if(!req.session.userID){
        res.redirect('/tlogin');
    }
    else{
        next();
    }
}

const DESTINATION_FOLDER = path.join('./public/uploads');


//storage for student
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,DESTINATION_FOLDER);
    },
    filename:async (req,file,cb)=>{
        let fileName = req.params.id+path.extname(file.originalname);

        let updateprofile = await studentmodel.findOneAndUpdate({id:req.params.id},{profile:fileName});
        console.log(fileName);
        cb(null,req.params.id+path.extname(file.originalname));
    }
});

//storage for teacher
const storage2 = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,DESTINATION_FOLDER);
    },
    filename:async (req,file,cb)=>{
        let fileName = req.params.id+path.extname(file.originalname);
        let updateprofile = await teachertmodel.findOneAndUpdate({id:req.params.id},{profile:fileName});
        cb(null,req.params.id+path.extname(file.originalname));
    }
});

const upload = multer({storage:storage});
const uploadteacher = multer({storage:storage2});



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



//Student Dashboard

app.get('/slogin',redirectDash,(req,res)=>{
        res.render('Student/slogin');

});
//Check Student Login
app.post('/slogin',StudentController.checkLogin);


app.get('/sdash',redirectLogin,async (req,res)=>{
    
    const stdata = await studentmodel.find({id:req.session.userID});
    res.render('Student/studentdashboard',{
        data:stdata
    });
    
    
});




//upload picture for student
app.post('/upimg/:id',upload.single("profile"),(req,res)=>{
    res.redirect('/sdash')
});
//upload picture for teacher
app.post('/uptimg/:id',uploadteacher.single("profile"),(req,res)=>{
    res.redirect('/tdash')
});






//Teacher Login Page
app.get('/tlogin',redirectTDash,(req,res)=>{
    res.render('Teacher/tlogin');
});

//Check Teacher Login
app.post('/tlogin',TeacherController.checkLogin);

//Teacher Dashboard
app.get('/tdash',redirectTLogin,async (req,res)=>{
    let tdata = await teachertmodel.find({teacher_id:req.session.userID});
    res.render('Teacher/teacherdashboard',{
        data:tdata
    });
});





//Logout route
app.get('/logout',(req,res)=>{
    if(req.session.userID){
        req.session.destroy();
    }
    res.redirect('/slogin');
});
//Logout teacher dash route
app.get('/logoutT',(req,res)=>{
    if(req.session.userID){
        req.session.destroy();
    }
    res.redirect('/tlogin');
});



// Teachers DATA Controller API
app.post('/sendteacherdata',TeacherController.sendDataAPI);


//Student DATA Controller API
app.post('/sendstudentdata',StudentController.sendDataAPI);





//Admin Route Section
app.get('/admindash',(req,res)=>{
    res.render('Admin/admindashboard');
});
app.get('/admindash/teacher',TeacherController.getDataAPI);
app.get('/admindash/student',StudentController.getDataAPI);
app.get('/count',CountController.getDataAPI);

module.exports = app;