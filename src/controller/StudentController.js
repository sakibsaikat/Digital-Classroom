const mongo = require("mongoose");
const session = require('express-session');
let StudentModel = require('./../model/studentModel');
let CountModel = require('./../model/countModel');

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
    res.render('studentReg', {
        sendStatus: "true"
    });
}

exports.getDataAPI = async (req, res) => {
    var student = await StudentModel.find();
    res.render('Admin/students',{
        data:student
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
   