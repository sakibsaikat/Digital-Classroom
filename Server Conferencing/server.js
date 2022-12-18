const express = require('express');
const app = express();
const expresServer = require('http').createServer(app);
const SocketIO = require('socket.io');
const io = new SocketIO.Server(expresServer);
const {v4:uuid} = require('uuid');
const PORT = 4500;


app.use(express.static('public'));
app.set('view engine','ejs');
app.use('/',require('./src/router/router.js'));


io.on('connection',socket=>{

    socket.on('join-room',(roomId)=>{
        socket.join(roomId);
        console.log('Joined in the room');

        socket.to(roomId).emit('new-join',"New User Connected");
    });


    //Recive and send offer

    socket.on('send-offer',(offer,roomID)=>{
        socket.to(roomID).emit('recive-offer',offer);
    });

    //Send Answer
    socket.on('send-answer',(answer,roomID)=>{
        socket.to(roomID).emit('recive-answer',answer);
    });

    
    //Send Ice candidate

    socket.on('send-icecandidate',(candidate,roomID)=>{
        socket.to(roomID).emit('recive-candidate',candidate);
    });


    console.log('Socket Connected');

    socket.on('disconnecting',()=>{
        io.emit('user-left',socket.id);
    });
});




expresServer.listen(PORT,(err)=>{
    if(!err){
        console.log(`Server is listening @ ${PORT}`)
    }
});