
document.getElementById("startStop").addEventListener("click", startStop);

//When user hits enter on input text feild function addToStorage is called
document.getElementById("hostname").addEventListener("change", addToStorage);


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

//Add to storage adds the new hostname to chrome.storage
//currently working somewhat, need to understand if 'siteName' is actually the hostnames like we want the keys to be

function addToStorage(){
    var siteName = document.getElementById("hostname").nodeValue;

    chrome.storage.sync.set({siteName: 100});

    chrome.storage.sync.get(siteName, function(data){
        alert(data.siteName);
    });
}
