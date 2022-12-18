const socket = io();
let peerConnection;

let video_focus = document.getElementById('focused-video');
let mic = document.getElementById('mic');
let camera = document.getElementById('cam');
let select_mic = document.getElementById('audio_devices');
let select_cam = document.getElementById('camera_devices');
let screen_share = document.getElementById('share');
let video_list = document.getElementById('video-list');


let mediaStream;
let micStatus=true;
let camStatus=true;
let shareStatus=false;

let currentAudio;
let currentCamera;
let Constraints;
let myVideoId;



mic.addEventListener('click',()=>{
    if(micStatus){
        mic.innerHTML = `<i class="fa-solid fa-microphone-lines-slash text-muted"></i>`;
        mediaStream.getAudioTracks().forEach((track)=>{
            track.enabled=false;
        });
        micStatus=false;
    }else{
        mic.innerHTML = `<i class="fa-solid fa-microphone-lines text-muted"></i>`;
        mediaStream.getAudioTracks().forEach(track=>{
            track.enabled=true;
        });
        micStatus=true;

    }
});

camera.addEventListener('click',()=>{
    if(camStatus){
        camera.innerHTML = `<i class="fa-solid fa-video-slash text-muted"></i>`;
        mediaStream.getVideoTracks().forEach((track)=>{
            track.enabled=false;
        });
        camStatus=false;
    }else{
        camera.innerHTML = `<i class="fa-solid fa-video text-muted"></i>`;
        mediaStream.getVideoTracks().forEach(track=>{
            track.enabled=true;
        });
        camStatus=true;

    }
});


let getAllCamera = async ()=>{
    // const cuurentCamera = mediaStream.getVideoTracks()[0];
    const allDevices = await window.navigator.mediaDevices.enumerateDevices();
    select_cam.innerHTML="";

    allDevices.forEach(device=>{
        if(device.kind==='videoinput'){
            const option = document.createElement('option');
            option.value=device.deviceId;
            option.textContent=device.label;
            option.selected = device.deviceId === currentCamera ? true : false;
            select_cam.appendChild(option);
        }
        
    });
}
select_cam.addEventListener('input',(e)=>{
    const deviceId = e.target.value;
    currentCamera=deviceId;
    getMedia(deviceId,null);
});



let getAllAudio = async ()=>{ 
    // const cuurentAudio = mediaStream.getAudioTracks()[0];
    const allDevices = await window.navigator.mediaDevices.enumerateDevices();
    select_mic.innerHTML="";

    allDevices.forEach(device=>{
        if(device.kind==='audioinput'){
            const option = document.createElement('option');
            option.value=device.deviceId;
            option.textContent=device.label;
            option.selected = device.deviceId === currentAudio ? true : false;
            select_mic.appendChild(option);
        }
        
    });
}

select_mic.addEventListener('input',(e)=>{
    const deviceId = e.target.value;
    currentAudio=deviceId;
    getMedia(null,deviceId);
});




let displayFocusMedia = (stream)=>{

    myVideoId = stream.id;
    video_focus.srcObject = stream;
    video_focus.addEventListener('loadedmetadata',()=>{
        video_focus.play();
    });
}

let displayMedia = (stream)=>{
    const div = document.createElement('div');
    const p = document.createElement('p');
    const videotag = document.createElement('video');
    videotag.srcObject=stream;
    videotag.id=stream.id;
    p.textContent="SAKIB";
    videotag.addEventListener('loadedmetadata',()=>{
        videotag.play();
    });
    div.appendChild(videotag);
    div.appendChild(p);
    video_list.appendChild(div);
}







let getMedia = async (cameraId,micId)=>{

    

    if(cameraId){
        Constraints = {
            video:true,
            audio:{
                deviceId:micId
            }
        };
    }
    else if(micId){
        Constraints = {
            video:{
                deviceId:cameraId
            },
            audio:true
        };
    }
    else{
        Constraints = {
            video:true,
            audio:true
        };
    }
    

    try{
        const stream = await window.navigator.mediaDevices.getUserMedia(Constraints); 
        mediaStream=stream;


        if(!(cameraId || micId)){
            displayFocusMedia(mediaStream);
            getAllCamera();
            getAllAudio();
            //RTC function
            makeWebRTCConnection();
            socket.emit('join-room',roomId);
        }else{

            const vidTrack = mediaStream.getVideoTracks()[0];
            const AudioTrack = mediaStream.getAudioTracks()[0];

            if(peerConnection){

                const sender = peerConnection.getSenders();
            
            if(cameraId){
                const videosenders = sender.find(sender=>
                    sender.track.kind==='video');
                videosenders.replaceTrack(vidTrack);
            }
            
            if(micId){
                const audiosenders = sender.find(sender=>
                    sender.track.kind==='audio');
                audiosenders.replaceTrack(AudioTrack);
            }
        }
        

            }

            


        //join room
        

    }catch(err){
        console.log(err);
    }
}


getMedia();



let getScreenCapture = async ()=>{
    try{
        mediaStream = await window.navigator.mediaDevices.getDisplayMedia({
            audio:true,
            video:true
        });
        const micTrack = await window.navigator.mediaDevices.getUserMedia({
            audio:true
        });

        mediaStream.addTrack(micTrack.getAudioTracks()[0],micTrack);
        
        video_focus.srcObject=mediaStream;




        const vidTrack = mediaStream.getVideoTracks()[0];



        const SysAudioTrack = mediaStream.getAudioTracks().find(track=>{
            return track.label==='System Audio'
        });
        const MicAudioTrack = mediaStream.getAudioTracks().find(track=>{
            return track.label!=='System Audio'
        });

        if(SysAudioTrack){
            peerConnection.addTrack(SysAudioTrack,mediaStream);
        }





        const sender = peerConnection.getSenders();

        const audiosenders = sender.filter(sender=>
            sender.track.kind==='audio');

        const videosenders = sender.find(sender=>
                sender.track.kind==='video');

        videosenders.replaceTrack(vidTrack);

        if(SysAudioTrack){
            audiosenders[0].replaceTrack(SysAudioTrack);
            audiosenders[1].replaceTrack(MicAudioTrack);
        }else{
            audiosenders[0].replaceTrack(MicAudioTrack);
        }
        




    }catch(err){
        console.log(err);
    }
}

screen_share.addEventListener('click',async ()=>{
    if(shareStatus){
        // getMedia(currentCamera,currentAudio);
        // Exercise

        mediaStream = await window.navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        });
        
        video_focus.srcObject=mediaStream;

        const vidTrack = mediaStream.getVideoTracks()[0];
            const AudioTrack = mediaStream.getAudioTracks()[0];

            if(peerConnection){

                const sender = peerConnection.getSenders();

                const videosenders = sender.find(sender=>
                    sender.track.kind==='video');
                videosenders.replaceTrack(vidTrack);

                const audiosenders = sender.find(sender=>
                    sender.track.kind==='audio');
                audiosenders.replaceTrack(AudioTrack);
            }


        shareStatus=false;
    }else{
        getScreenCapture();
        shareStatus=true;
    }
});




//socket

socket.on('new-join',(data)=>{
    console.log("New User Joined");
    makeOffer();
});



//Web RTC Connection

function makeWebRTCConnection(){

    peerConnection = new RTCPeerConnection({
        urls:[
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302',
        ]
    });

    //Add Media Tracks to RTC
    mediaStream.getTracks().forEach(track=>{
        peerConnection.addTrack(track,mediaStream);
    });

    peerConnection.addEventListener('icecandidate',(data)=>{
        //Send Ice
        socket.emit('send-icecandidate',data.candidate,roomId);
    });

    peerConnection.addEventListener('addstream',(data)=>{
        displayMedia(data.stream);
    });

}


async function makeOffer(){
    const offer = await peerConnection.createOffer();
    //Remember offer info
    peerConnection.setLocalDescription(offer);
    //Send offer Using Socket
    socket.emit('send-offer',offer,roomId);
}


socket.on('recive-offer',async (offer)=>{
    peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    peerConnection.setLocalDescription(answer);

    //Send the Answer
    socket.emit('send-answer',answer,roomId);
});


//receive answer
socket.on('recive-answer',(answer)=>{
    peerConnection.setRemoteDescription(answer);
    
});


//Recive Ice
socket.on('recive-candidate',(candidate)=>{
    peerConnection.addIceCandidate(candidate);
});


socket.on('user-left',(socketid)=>{
    // let rem = document.querySelector(`#video-list div #${socketid}`);
    console.log(socketid);

});