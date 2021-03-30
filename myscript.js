
document.getElementById("startStop").addEventListener("click", startStop);

//When user hits enter on input text field function addToStorage is called
// document.getElementById("hostname").addEventListener("change", addToStorage);

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
        status = "started";
    }

    else {
        window.clearInterval(interval);
        document.getElementById("startStop").innerHTML = "Start";
        //chrome.action.setBadgeText({text: "10"}); // Clears badge (Only works in background.js so disabled until migration)
        status = "stopped";
    }
}

//Add to storage adds the new hostname to chrome.storage
//currently working somewhat, need to understand if 'siteName' is actually the hostnames like we want the keys to be

function addToStorage() {
    var siteName = document.getElementById("hostname").nodeValue;

    chrome.storage.sync.set({ siteName: 100 });

    chrome.storage.sync.get(siteName, function (data) {
        alert(data.siteName);
    });
}
