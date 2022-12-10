let success_btn = document.getElementById("success-btn");
let form1 = document.getElementById("form1");
let sbt = document.getElementById("sbt");
let checks = document.getElementsByClassName("form-check-input");
let weekdays = document.getElementById("weekdays");

sbt.addEventListener('click',function(e){
    e.preventDefault();

    let weekstr="";

    for(let x=0;x<checks.length;x++){
        if(checks[x].checked == true){
            weekstr+=(checks[x].value + "-");
        }
    }
    weekstr = weekstr.substring(0,(weekstr.length-1));
    weekdays.value=weekstr;

    const data = new URLSearchParams();
    for(const pair of new FormData(form1)){
        data.append(pair[0],pair[1]);
    }

    //Making AJAX Request
    let xhr = new XMLHttpRequest();
    xhr.open('POST','/sendRoomData',true);

    xhr.onload = function(){
        if(this.readyState==4 && this.status==200){
            let res = this.responseText;
            if(res.trim()=="ok"){
                form1.reset();
                success_btn.click();
            }
        }
    }


    xhr.send(data);
    

});
