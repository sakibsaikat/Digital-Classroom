const mongo = require('mongoose');
let TeacherModel = require('./../model/teacherModel');



exports.sendDataAPI = async (req,res)=>{

    const {name,email,password,gender,contact,department} = req.body;
    const status = "approved";

    let sendData = await new TeacherModel({
        name,email,password,gender,contact,department,status
    }).save();

    res.render('teacherReg',{
        sendStatus:"true"
    });


}

exports.getDataAPI = (req,res)=>{

}