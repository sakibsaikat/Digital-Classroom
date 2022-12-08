const mongo = require("mongoose");
let StudentModel = require('./../model/studentModel');

exports.sendDataAPI = async (req,res) => {
    const {
        name, student_id, email, password, department, gender, contact
    } = req.body;
    const status = "approved";
    let sendData = await new StudentModel({
        name, student_id, email, password, department, gender, contact, status
    }).save();
    res.render('studentReg', {
        sendStatus: "true"
    });
}

exports.getDataAPI = async (req, res) => {
    var student = await StudentModel.find({});
        res.render('admindashboard',{title: 'Students data:', records: student});
}