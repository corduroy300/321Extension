
document.getElementById("startStop").addEventListener("click", startStop);

let interval = null;
let status = "stopped";
function recordTime(){
    let today = new Date();

    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    document.getElementById("display").innerHTML = hours + ":"+minutes+":"+seconds;


}

function startStop(){

    if(status === "stopped"){
        interval = window.setInterval(recordTime, 1000);
        document.getElementById("startStop").innerHTML = "Stop";
        status = "started";
    }

    else{
        window.clearInterval(interval);
        document.getElementById("startStop").innerHTML = "Start";
        status = "stopped";
    }
}