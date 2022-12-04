const express = require('express');
const app = express();
const port = 4500;


app.use(express.static('public'));
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/contact',(req,res)=>{
    res.render('contact');
});

app.get('/regtec',(req,res)=>{
    res.render('teacherReg');
}); 



app.listen(port,(err)=>{
    if(!err){
        console.log(`Server is listening at PORT: ${port}`);
    }
    else{
        console.log(err);
    }
});
