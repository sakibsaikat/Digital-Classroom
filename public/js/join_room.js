let success_btn = document.getElementById("success-btn");
let form1 = document.getElementById("form2");
let sbt = document.getElementById("sbtn");


sbt.addEventListener('click',function(e){
    e.preventDefault();

    const data = new URLSearchParams();
    for(const pair of new FormData(form1)){
        data.append(pair[0],pair[1]);
    }

    //Making AJAX Request
    let xhr = new XMLHttpRequest();
    xhr.open('POST','/join_room',true);

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
