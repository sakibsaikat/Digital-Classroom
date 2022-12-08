
const mongo = require("mongoose");
let CountModel = require('./../model/countModel');


exports.getDataAPI = async (req, res) => {
    var count = await CountModel.find({});
        res.render('Admin/count',{
            data:count
        });
}