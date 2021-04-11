
document.getElementById("startStop").addEventListener("click", alertBackground);
document.getElementById("reset"). addEventListener("click", reset)

//When user hits enter on input text field function addToStorage is called
/*document.getElementById("hostname").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addToStorage();
    }
});*/

//var unproductiveTabsList = {};

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

function reset (){
    chrome.runtime.sendMessage({cmd: 'RESET'});
    document.getElementById("display").innerHTML = "00:00:00";
    chrome.storage.sync.clear(function() {});
    //alert("reset");
}


//Add to storage adds the new hostname to chrome.storage
//currently working somewhat, need to understand if 'siteName' is actually the hostnames like we want the keys to be

/*function addToStorage() {
    var siteName = document.getElementById("hostname").value;

    var infoOfSite = {
        url: siteName,
        timeSpent: 0,
        lastTimeVisited: 0,
    };

    if(typeof unproductiveTabsList[siteName] === 'undefined'){
        unproductiveTabsList[siteName] = infoOfSite;
        alert("added");
    }

}*/
