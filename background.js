

/*chrome.tabs.onActivated.addListener(tab =>{
    chrome.tabs.get(tab.tabId, tab_info =>{
        console.log(tab_info.url)
    });
});*/
console.log("hello world");
let urlMap = new Map();

chrome.tabs.onActiveChanged.addListener(function (windowId) {
    if (windowId == chrome.windows.WINDOW_ID_NONE){
        tabTrack(false);
    }
    else{
        tabTrack(true);
    }
});

function tabTrack(isWindowActive){

    chrome.tabs.query({'active': true}, function(tabs){

        //console.log(tabs);

        let url = tabs[0].url;
        let title = tabs[0].title;
        let currentTab = tabs[0];
        let hostName = url;
        urlMap.set(hostName, 1);
        try{
            let urlObject = new URL(url);
            hostName = urlObject.hostname;
        } catch (e){
            console.log("Error in getting hostname from url");
        }
        console.log(hostName);
        console.log("printing from hash map: " + hostName);




    });
}


