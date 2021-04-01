
document.getElementById("startStop").addEventListener("click", startStop);

//When user hits enter on input text field function addToStorage is called
/*document.getElementById("hostname").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addToStorage();
    }
});*/

//var unproductiveTabsList = {};

let interval = null;
let status = "stopped";
function recordTime() {
    let today = new Date();

    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    document.getElementById("display").innerHTML = hours + ":" + minutes + ":" + seconds;
}

function startStop() {

    if (status === "stopped") {
        interval = window.setInterval(recordTime, 1000);
        document.getElementById("startStop").innerHTML = "Stop";
        //chrome.action.setBadgeText({text: "10"}); // Sets badge (Only works in background.js so disabled until migration)
        document.getElementById("webManagerButton").style.visibility =  "hidden";
        status = "started";
    }

    else {
        window.clearInterval(interval);
        document.getElementById("startStop").innerHTML = "Start";
        //chrome.action.setBadgeText({text: "10"}); // Clears badge (Only works in background.js so disabled until migration)
        document.getElementById("webManagerButton").style.visibility =  "visible";
        status = "stopped";
    
    }
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
