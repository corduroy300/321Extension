const unproductiveTabsKey = "unproductiveTabs";
var unproductiveTabs;

//sets the unproductiveTabs object to the value saved in chrome storage
chrome.storage.sync.get(unproductiveTabsKey, function (result) {
    let listOfUnproductiveTabs = result[unproductiveTabsKey];
    //need to parse the string in storage into JSON objects
    if (listOfUnproductiveTabs != null) {
        //alert("This happened");
        unproductiveTabs = JSON.parse(listOfUnproductiveTabs);
    } 
});

document.getElementById("hostname").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addToStorage();
    }
});

/* Adds user specified sites into unproductive list
* Checks to make sure that this site  isn't already added
*/
function addToStorage() {

    var siteName = document.getElementById("hostname").value;

    var infoOfSite = {
        "url": siteName,
        "timeSpent": 0,
        "lastTimeVisited": Date.now(),
    };

    if(unproductiveTabs == null){
        unproductiveTabs =  {};
        unproductiveTabs[siteName] = infoOfSite;
        alert("added because list is empty " + unproductiveTabs[siteName].url);
    } else if(typeof unproductiveTabs[siteName] === 'undefined'){
        unproductiveTabs[siteName] = infoOfSite;
        alert("added because this is new url " + unproductiveTabs[siteName].url);
    } else {
        alert("site was not added because it is duplicate");
    }

    //After setting the new site name, we need to update this object in chrome storage so that the values are updated across all files
    const tabTimesObjectString = JSON.stringify(unproductiveTabs);
    let newTabTimesObject = {};
    newTabTimesObject[unproductiveTabsKey] = tabTimesObjectString;
    chrome.storage.sync.set(newTabTimesObject, function () {
        chrome.storage.sync.get(unproductiveTabsKey, function (result) {
            alert("current unproductiveTabsList is: " + result[unproductiveTabsKey])});
    });

}