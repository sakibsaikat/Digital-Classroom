const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express.Router();
const multer = require('multer');
const studentmodel = require('./../model/studentModel');
const teachertmodel = require('./../model/teacherModel');
const roomModel = require('./../model/roomModel');
const classModel = require('./../model/classDetailsModel');
const PostModel = require('./../model/teacherPostModel');
let CommentModel = require('./../model/commentModel');

const TeacherController = require('./../controller/TeacherController');
const StudentController = require('./../controller/StudentController');
const CountController = require('./../controller/countController');
const RoomController = require('./../controller/roomController');
const ClassDetailsController = require('./../controller/classDetailsController');
const teacherPostController = require('./../controller/teacherPostController');
const commentController = require('./../controller/commentController');


const {v4:uuid} = require('uuid');




//video Conferencing
app.get('/meeting/:roomId',(req,res)=>{
    res.render('room',{
        roomId:req.params.roomId
    });
});



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
        let updateprofile = await teachertmodel.findOneAndUpdate({teacher_id:req.params.id},{profile:fileName});
        console.log(updateprofile);
        cb(null,req.params.id+path.extname(file.originalname));
    }
});

const upload = multer({storage:storage});
const uploadteacher = multer({storage:storage2});



//Web Homepage route

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/about',(req,res)=>{
    res.render('about-nub');
});
app.get('/msgc',(req,res)=>{
    res.render('msg_chairman');
});
app.get('/msgvc',(req,res)=>{
    res.render('msg_vc');
});
app.get('/vision',(req,res)=>{
    res.render('vision');
});
app.get('/faculty',(req,res)=>{
    res.render('faculty');
});




//Class Room Homepage Route Section
app.get('/home',(req,res)=>{
    res.render('home');
});



//Registration Route Section
app.get('/regtec',(req,res)=>{
    res.render('teacherReg',{
        sendStatus:"false"
    });
}); 
app.get('/regtec/success',(req,res)=>{
    res.render('teacherReg',{
        sendStatus:"true"
    });
}); 
app.get('/regstu',(req,res)=>{
    res.render('studentReg',{
        sendStatus:"false"
    });
});
app.get('/regstu/success',(req,res)=>{
    res.render('studentReg',{
        sendStatus:"true"
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
    const roomData = await classModel.find({student_id:req.session.userID});

    let teachers = [];
    let qarray = [];
    let i=0;
    roomData.forEach(function(val){
        qarray[i]={
            room_no:val.room_no
        };
        teachers[i]={
            teacher_id:val.teacher_id
        };

        i++;
    });

    try{

        teacherInfo = await teachertmodel.find({$or: teachers});
        roomInfo = await roomModel.find({$or: qarray});

    }catch(err){
        teacherInfo = {};
        roomInfo = {};
        console.log(err);
    }

   


    res.render('Student/studentdashboard',{
        data:stdata,
        room:roomInfo,
        tdata:teacherInfo
    });
    
    
});

//Show Post for student
app.get('/spost/:rid/:tid/:stid',redirectLogin,async (req,res)=>{

    try{
        let tdata = await teachertmodel.find({teacher_id:req.params.tid});
        let rdata = await roomModel.find({room_no:req.params.rid});
        let pdata = await PostModel.find({room_no:req.params.rid});
        let cdata = await CommentModel.find({room_no:req.params.rid});
        let sdata = await studentmodel.find({id:req.params.stid});

        res.render('Student/studentpost',{
            tdata:tdata,
            rdata:rdata,
            pdata:pdata,
            cdata:cdata,
            sdata:sdata
        });

    }catch(err){
        console.log(err);
    }

    
});
//Teacher Send Comment
app.post('/stsendcomment',redirectLogin,commentController.sendStDataAPI);




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
    let rdata = await roomModel.find({teacher_id:req.session.userID});
    res.render('Teacher/teacherdashboard',{
        data:tdata,
        rdata:rdata
    });
});
//Teacher Post
app.get('/tpost/:rid/:tid',redirectTLogin,async (req,res)=>{

    try{
        let tdata = await teachertmodel.find({teacher_id:req.params.tid});
        let rdata = await roomModel.find({room_no:req.params.rid});
        let pdata = await PostModel.find({room_no:req.params.rid});
        let cdata = await CommentModel.find({room_no:req.params.rid});

        res.render('Teacher/teacherpost',{
            tdata:tdata,
            rdata:rdata,
            pdata:pdata,
            cdata:cdata
        });

    }catch(err){
        console.log(err);
    }

    
});
//Teacher posting...
app.post('/create_post',teacherPostController.sendDataAPI);
//Teacher Send Comment
app.post('/sendcomment',commentController.sendDataAPI);
//Teacher List
app.get('/slist/:room_no',StudentController.getDataAPIS);





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




//Room Route Section
app.get('/createroom',redirectTLogin,(req,res)=>{
    res.render('Teacher/createRoom');
})

app.post('/sendRoomData',RoomController.sendDataAPI);
app.post('/join_room',redirectLogin,ClassDetailsController.sendDataAPI);

module.exports = app;