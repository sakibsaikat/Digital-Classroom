const mongo = require("mongoose");
const session = require('express-session');
let StudentModel = require('./../model/studentModel');
let CountModel = require('./../model/countModel');
let ClassModel = require('./../model/classDetailsModel');


exports.sendDataAPI = async (req,res) => {
    const {
        name, student_id, email, password, department, gender, contact
    } = req.body;
    const status = "approved";

    let countObj = await CountModel.find();

    countObj.forEach(function(val){
        sid=val._id;
        studentCount=val.student;
    });

    const s_count = (parseInt(studentCount)+1).toString();

    const id = `NUB-S-${s_count}`;
    

    let updateCount = await CountModel.findByIdAndUpdate({_id:sid},{student:s_count});




    let sendData = await new StudentModel({
        id,name, student_id, email, password, department, gender, contact, status
    }).save();
    res.redirect('/regstu/success');
}

exports.getDataAPI = async (req, res) => {
    var student = await StudentModel.find();
    res.render('Admin/students',{
        data:student
    });
}

//Specific
exports.getDataAPIS = async (req, res) => {

    console.log(req.params.room_no);
     
    const roomData = await ClassModel.find({room_no:req.params.room_no});

    let students = [];
    let i=0;

    roomData.forEach(function(val){

        students[i]={
            id:val.student_id
        };

        i++;
    });

    console.log(students);

    try{
        studentInfo = await StudentModel.find({$or: students});
    }catch(err){
        studentInfo = {};
        console.log(err);
    }


    console.log(studentInfo);

    res.render('Teacher/studentlist',{
        data:studentInfo
    });
}


exports.checkLogin = async (req,res)=>{

        if(!req.session.userID){
            let reqemail = req.body.email;

            var student = await StudentModel.find({email:reqemail});
    
            student.forEach(function (val) {
                email = val.email;
                ps = val.password;
                stu_id = val.id;
            });
        
            if(email==reqemail){
                if(ps==req.body.password){
                    req.session.userID=stu_id;
                    res.redirect('/sdash');
                }
            }else{
                console.log("No User Found.");
            }
        
            
        }
        res.render('Student/slogin');
    

}
   