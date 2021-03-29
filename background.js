const unproductiveTabsKey = "unproductiveTabs";
const lastActiveTabKey = "lastActiveTab";
var isRecording = true;
var initialize = false;

/*chrome.tabs.onActivated.addListener(tab =>{
    chrome.tabs.get(tab.tabId, tab_info =>{
        console.log(tab_info.url)
    });
});*/
console.log("hello world");


chrome.tabs.onActiveChanged.addListener(function () {
    if(isRecording){
        if(!initialize){
            initializeUnproductiveWebsites();
            initialize = true;
        }
        tabTrack();
    }
});

function tabTrack(){
    
    //search for the current active tab
    chrome.tabs.query({'active': true}, function(tabs){

        let url = tabs[0].url;
        let title = tabs[0].title;
        let currentTab = tabs[0];
        let hostName = url;
        let urlObject = new URL(url);
        hostName = urlObject.hostname;

    //retrieves the unproductiveTabsList and the lastActiveTab from chrome storage
        chrome.storage.sync.get([unproductiveTabsKey, lastActiveTabKey], function(result){
            let listOfUnproductiveTabs = result[unproductiveTabsKey];
            let lastActiveTab = result[lastActiveTabKey];

            //need to parse the string in storage into JSON objects
            unproductiveTabs = {};
            if(listOfUnproductiveTabs != null){
                unproductiveTabs = JSON.parse(listOfUnproductiveTabs);
            }
            lastActiveTabJSON = {};
            if(lastActiveTab != null){
                lastActiveTabJSON = JSON.parse(lastActiveTab);
            }

            if(Object.keys(lastActiveTabJSON).length != 0){
                let lastActiveTabURL = lastActiveTabJSON["url"];
                let numOfPassedSeconds = (Date.now() - lastActiveTabJSON["lastTimeVisited"]) * 0.001; //converts milliseconds to seconds


                // if the last active tab is an unproductive website, increment the time spent on that site
                // if not, then ignore the unproductiveTabObject and update the lastActiveTab object in storage
                if(unproductiveTabs.hasOwnProperty(lastActiveTabURL)){
                    let lastActiveTabValue = unproductiveTabs[lastActiveTabURL];
                    lastActiveTabValue["timeSpent"] = numOfPassedSeconds;
                    lastActiveTabValue["lastTimeVisited"] = Date.now();
                }
    
            }
            
            //storing current tab user is in to lastActiveTab object in storage
            //since chrome.storage api can only store strings, need to turn the JSON object to a JSON string for storage
            let updatedLastActiveTab = {"url": hostName, "lastTimeVisited": Date.now()};
            updatedLastActiveTabJSONString = JSON.stringify(updatedLastActiveTab);
            let newLastTabObject = {};
            newLastTabObject[lastActiveTabKey] = updatedLastActiveTabJSONString;

            //set both unproductiveTabs and lastActiveTab back in storage using preset keys
            chrome.storage.sync.set(newLastTabObject, function(){
                console.log("last active tab stored: " +hostName);
                const tabTimesObjectString = JSON.stringify(unproductiveTabs);
                let newTabTimesObject = {};
                newTabTimesObject[unproductiveTabsKey] = tabTimesObjectString;
                chrome.storage.sync.set(newTabTimesObject, function(){

                });
            });
        
        });
    });
    
}

function initializeUnproductiveWebsites(){

    //currently sets the list of unproductive websites as youtube and netflix.
    //the tabTrack function will compare the users tabs against this list
    //needs further implementation to incorporate user data
    unproductiveTabsList = {
        "www.youtube.com" : {
            url: "www.youtube.com",
            timeSpent: 0,
            lastTimeVisited: Date.now()
        },
        "www.netflix.com" :{
            url: "www.netflix.com",
            timeSpent: 0,
            lastTimeVisited: Date.now()
        }
    }
    const tabTimesObjectString = JSON.stringify(unproductiveTabsList);
    let newTabTimesObject = {};
    newTabTimesObject[unproductiveTabsKey] = tabTimesObjectString;
    chrome.storage.sync.set(newTabTimesObject, function(){

    });
}


