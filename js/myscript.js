var startListener = document.getElementById('startStop');
var resetListener = document.getElementById('reset');
var reportListner = document.getElementById('reportButton');

if (startListener) {
    startListener.addEventListener("click", alertBackground);
}
if (resetListener) {        
    resetListener.addEventListener("click", reset);
}
if(reportListner){
    reportListner.addEventListener("click", viewReport);
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message.newSeconds !== undefined){
        updateTime(message.newSeconds, message.newMinutes, message.newHours);
    }
    else{
        updateButtons(message.startStop, message.webManagerVisibility);
    }
    
});


function alertBackground(){
    //alert("alerting to bg.js");
    chrome.runtime.sendMessage({cmd: 'START_TIME' });
}

function updateTime(seconds,minutes,hours){
    document.getElementById("display").innerHTML = hours + ":" + minutes + ":" + seconds;
}

function updateButtons(startStop, webManagerVisibility){
    document.getElementById("startStop").innerHTML = startStop;
    document.getElementById("webManagerButton").style.visibility = webManagerVisibility;
}

/* Handles reseting the chrome storage aswell as the display when the 'End' button is clicked
* Sends a runtime message that is handled by background.js
* myScript.js needs to handle the reset functionality alongside background.js because myScript does not have access to all the code needed by reset
*/
function reset (){
    // Opens report.html as a popup
    /*chrome.windows.create({
        'url': '/html/report.html', 'type': 'popup', 'height': 500, 'width': 400
    });*/
    chrome.runtime.sendMessage({cmd: 'RESET'});
    document.getElementById("display").innerHTML = "00:00:00";
    chrome.storage.sync.clear(function() {});
    //alert("reset");
}

function viewReport(){
    chrome.windows.create({
        'url': '/html/report.html', 'type': 'popup', 'height': 500, 'width': 400
    });
}
