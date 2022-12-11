const mongo = require('mongoose');
let TeacherModel = require('./../model/teacherModel');
let CountModel = require('./../model/countModel');
const { findByIdAndDelete, findByIdAndUpdate } = require('../model/studentModel');



exports.sendDataAPI = async (req,res)=>{

    const {name,email,password,gender,contact,department} = req.body;
    const status = "approved";

    let countObj = await CountModel.find();


    countObj.forEach(function(val){
        id=val._id;
        teacherCount=val.teacher;
    });

    const t_count = (parseInt(teacherCount)+1).toString();

    const teacher_id = `NUB-T-${t_count}`;
    

    let updateCount = await CountModel.findByIdAndUpdate({_id:id},{teacher:t_count});

    

    let sendData = await new TeacherModel({
        teacher_id,name,email,password,gender,contact,department,status
    }).save();

    res.redirect('/regtec/success');


}

exports.getDataAPI = async (req, res) => {
    var teacher = await TeacherModel.find();
    res.render('Admin/teachers',{
        data:teacher
    });
}


exports.checkLogin = async (req,res)=>{
  
    if(!req.session.userID){

        var teacher = await TeacherModel.find({email:req.body.email});

        teacher.forEach(function(val){
            em = val.email;
            ps=val.password;
            t_id=val.teacher_id;
        });
    
        if(em==req.body.email){
            if(ps==req.body.password){
                req.session.userID=t_id;
                res.redirect('/tdash');
            }
        }else{
            console.log("No User Found.");
        }
    
        
    }
    res.render('Teacher/tlogin');

}