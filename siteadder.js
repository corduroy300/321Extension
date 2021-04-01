const unproductiveTabsKey = "unproductiveTabs";
var unproductiveTabs;

chrome.storage.sync.get(unproductiveTabsKey, function (result) {
    let listOfUnproductiveTabs = result[unproductiveTabsKey];

    //need to parse the string in storage into JSON objects
    if (listOfUnproductiveTabs != null) {
        unproductiveTabs = JSON.parse(listOfUnproductiveTabs);
    }
});

document.getElementById("hostname").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addToStorage();
    }
});

function addToStorage() {
    var siteName = document.getElementById("hostname").value;

    alert("here site name is: " + siteName);
    var infoOfSite = {
        url: siteName,
        timeSpent: 0,
        lastTimeVisited: 0,
    };

    //alert(unproductiveTabsList[siteName]);

    if(typeof unproductiveTabs[siteName] === 'undefined'){
        unproductiveTabs[siteName] = infoOfSite;
        alert("added accessing url from unproductiveTabList Object: " + unproductiveTabs[siteName].url);
    }

    const tabTimesObjectString = JSON.stringify(unproductiveTabs);
    let newTabTimesObject = {};
    newTabTimesObject[unproductiveTabsKey] = tabTimesObjectString;
    chrome.storage.sync.set(newTabTimesObject, function () {

    });

}