const unproductiveTabsKey = "unproductiveTabs";
const lastActiveTabKey = "lastActiveTab";
var isRecording = false;
//var initialize = false;

//alert("refreshed");
/*chrome.tabs.onActivated.addListener(tab =>{
    chrome.tabs.get(tab.tabId, tab_info =>{
        console.log(tab_info.url)
    });
});*/
//console.log("hello world");



chrome.tabs.onActivated.addListener(function () {
    if (isRecording) {
        chrome.storage.sync.get(unproductiveTabsKey, function(result){
            let unproductiveTabs = result[unproductiveTabsKey];
            if(unproductiveTabs != null){
                tabTrack();
            }
            else{
                console.log("No websites in unproductive list");
            }
        });
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tabInfo){
    if(changeInfo.url){
        if (isRecording) {
            chrome.storage.sync.get(unproductiveTabsKey, function(result){
                let unproductiveTabs = result[unproductiveTabsKey];
                if(unproductiveTabs != null){
                    tabTrack();
                }
                else{
                    console.log("No websites in unproductive list");
                }
            });
        }
    }
});

function tabTrack() {

    //search for the current active tab
    chrome.tabs.query({ 'active': true }, function (tabs) {

        let url = tabs[0].url;
        let hostName = url;
        try{
            let urlObject = new URL(url);
            hostName = urlObject.hostname;
        } catch{
            console.log("Cannot retrieve URL from tab");
        }

        //retrieves the unproductiveTabsList and the lastActiveTab from chrome storage
        chrome.storage.sync.get([unproductiveTabsKey, lastActiveTabKey], function (result) {
            let listOfUnproductiveTabs = result[unproductiveTabsKey];
            let lastActiveTab = result[lastActiveTabKey];

            //need to parse the string in storage into JSON objects
            unproductiveTabs = {};
            if (listOfUnproductiveTabs != null) {
                unproductiveTabs = JSON.parse(listOfUnproductiveTabs);
            }
            lastActiveTabJSON = {};
            if (lastActiveTab != null) {
                lastActiveTabJSON = JSON.parse(lastActiveTab);
            }

            if (Object.keys(lastActiveTabJSON).length != 0) {
                let lastActiveTabURL = lastActiveTabJSON["url"];
                let numOfPassedSeconds = (Date.now() - lastActiveTabJSON["lastTimeVisited"]) * 0.001; //converts milliseconds to seconds
                if(numOfPassedSeconds >= 300){
                    //end product needs to be another form of alert
                    console.log("you spent too much time!");
                }

                // if the last active tab is an unproductive website, increment the time spent on that site
                // if not, then ignore the unproductiveTabObject and update the lastActiveTab object in storage
                if (unproductiveTabs.hasOwnProperty(lastActiveTabURL)) {
                    let lastActiveTabValue = unproductiveTabs[lastActiveTabURL];
                    lastActiveTabValue["timeSpent"] += numOfPassedSeconds;
                    lastActiveTabValue["lastTimeVisited"] = Date.now();
                }
            }

            //storing current tab user is in to lastActiveTab object in storage
            //since chrome.storage api can only store strings, need to turn the JSON object to a JSON string for storage
            let updatedLastActiveTab = { "url": hostName, "lastTimeVisited": Date.now() };
            updatedLastActiveTabJSONString = JSON.stringify(updatedLastActiveTab);
            let newLastTabObject = {};
            newLastTabObject[lastActiveTabKey] = updatedLastActiveTabJSONString;

            //set both unproductiveTabs and lastActiveTab back in storage using preset keys
            chrome.storage.sync.set(newLastTabObject, function () {
                console.log("last active tab stored: " + hostName);
                const tabTimesObjectString = JSON.stringify(unproductiveTabs);
                let newTabTimesObject = {};
                newTabTimesObject[unproductiveTabsKey] = tabTimesObjectString;
                chrome.storage.sync.set(newTabTimesObject, function () {

                });
            });
        });
    });
}

/*function hasWebsitesStored(){
    chrome.storage.sync.get(unproductiveTabsKey, function(result){
        console.log(result[unproductiveTabsKey]);
        let unproductiveTabs = result[unproductiveTabsKey];
        if(unproductiveTabs === null){
            return false;
        }
        else{
            return true;
        }
    });
}*/

function unpause(){
    chrome.storage.sync.get(lastActiveTabKey, function (result){
        let lastActiveTabString = result[lastActiveTabKey];
        if(lastActiveTabString != null){
            lastActiveTab = JSON.parse(lastActiveTabString);
            lastActiveTab["lastTimeVisited"] = Date.now();

            lastActiveTabString = JSON.stringify;
            let newActiveTabObject = {};
            newActiveTabObject[lastActiveTabKey] = lastActiveTabString;
            chrome.storage.sync.set(newActiveTabObject, function(){

            });
        }
    })
}

/*function initializeUnproductiveWebsites() {
    //currently sets the list of unproductive websites as youtube and netflix.
    //the tabTrack function will compare the users tabs against this list
    //needs further implementation to incorporate user data
    unproductiveTabsList = {
        "www.youtube.com": {
            url: "www.youtube.com",
            timeSpent: 0,
            lastTimeVisited: Date.now()
        },
        "www.netflix.com": {
            url: "www.netflix.com",
            timeSpent: 0,
            lastTimeVisited: Date.now()
        }
    }

    const tabTimesObjectString = JSON.stringify(unproductiveTabsList);
    let newTabTimesObject = {};
    newTabTimesObject[unproductiveTabsKey] = tabTimesObjectString;
    chrome.storage.sync.set(newTabTimesObject, function () {

    });
}*/



// RECORDING FUNCTIONALITY FROM myscript.js
////////////////////////////////////////////////////////////////////////////////////////////

let interval = null;
let status = "stopped";
let seconds = 0;
let minutes = 0;
let hours = 0;
//alert("refreshed");

let displaySeconds = '00';
let displayMinutes = '00';
let displayHours = '00';

chrome.runtime.onMessage.addListener(handleMessage);

function handleMessage(message, sender, sendResponse){
    //alert("received msg from bg");
    if(message.cmd === 'START_TIME'){
        startStop();
    }

    if(message.cmd == 'RESET'){
        resetTimes();
    }
}


function recordTime() {
    seconds ++;

    if(seconds/60 === 1){
        seconds = 0;
        minutes++;
        
        if(minutes/60 === 1){
            minutes = 0;
            hours++;
        }
    }

    if (seconds < 10){
        displaySeconds = "0" +seconds.toString();
    }
    else{
        displaySeconds = seconds;
    }
    if (minutes < 10){
        displayMinutes = "0" +minutes.toString();
    }
    else{
        displayMinutes = minutes;
    }
    if (hours < 10){
        displayHours = "0" +hours.toString();
    }
    else{
        displayHours = hours;
    }


    sendTimeInfo();
    
}

setInterval(sendTimeInfo, 100);

function sendTimeInfo(){
    chrome.runtime.sendMessage({newSeconds: displaySeconds, newMinutes: displayMinutes, newHours: displayHours});
    if(status === 'started'){
        chrome.runtime.sendMessage({startStop: "Stop", webManagerVisibility: "hidden"});
    }
}

function startStop() {

    if (status === "stopped") {
        unpause();
        isRecording = true;
        interval = window.setInterval(recordTime, 1000);
        //document.getElementById("startStop").innerHTML = "Stop";
        //chrome.action.setBadgeText({text: "10"}); // Sets badge (Only works in background.js so disabled until migration)
        //document.getElementById("webManagerButton").style.visibility =  "hidden";
        chrome.runtime.sendMessage({startStop: "Stop", webManagerVisibility: "hidden"});
        status = "started";
    }

    else {
        isRecording = false;
        window.clearInterval(interval);
        //document.getElementById("startStop").innerHTML = "Start";
        //chrome.action.setBadgeText({text: "10"}); // Clears badge (Only works in background.js so disabled until migration)
        //document.getElementById("webManagerButton").style.visibility =  "visible";
        chrome.runtime.sendMessage({startStop: "Start", webManagerVisibility: "visible"});
        status = "stopped";
    
    }
}



function resetTimes(){
    seconds = 0; 
    minutes = 0;
    hours = 0;
    displaySeconds = '00';
    displayHours = '00';
    displayMinutes = '00';
    status = 'started';
    startStop();
    chrome.runtime.sendMessage({startStop: "Start", webManagerVisibility: "visible"});

}

function timeConversion(seconds){
    return seconds/60.0; 
}