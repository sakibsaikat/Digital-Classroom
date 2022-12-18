let video_focus = document.getElementById('focused-video');
let mic = document.getElementById('mic');
let camera = document.getElementById('cam');
let select_mic = document.getElementById('audio_devices');
let select_cam = document.getElementById('camera_devices');
let screen_share = document.getElementById('share');


let mediaStream;
let micStatus=true;
let camStatus=true;
let shareStatus=true;

let currentAudio;
let currentCamera;
let Constraints;



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
        displayMedia();
        getAllCamera();
        getAllAudio();

    }catch(err){
        console.log(err);
    }
}


let displayMedia = ()=>{
    video_focus.srcObject = mediaStream;
    video_focus.addEventListener('loadedmetadata',()=>{
        video_focus.play();
    });
}

getMedia();



let getScreenCapture = async ()=>{
    try{
        mediaStream = await window.navigator.mediaDevices.getDisplayMedia({
            audio:true,
            video:true
        });
        displayMedia();

    }catch(err){
        console.log(err);
    }
}

screen_share.addEventListener('click',()=>{
    if(shareStatus){
        getMedia();
        shareStatus=false;
    }else{
        getScreenCapture();
        shareStatus=true;
    }
});