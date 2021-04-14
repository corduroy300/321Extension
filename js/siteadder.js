const unproductiveTabsKey = "unproductiveTabs";
var unproductiveTabs;

/* Retrevies the unproductive tabs stored in chrome storage
* Global variable unproductiveTabs holds this object
*/
chrome.storage.sync.get(unproductiveTabsKey, function (result) {
    let listOfUnproductiveTabs = result[unproductiveTabsKey];

    //need to parse the string in storage into JSON objects
    if (listOfUnproductiveTabs != null) {
        unproductiveTabs = JSON.parse(listOfUnproductiveTabs);
    } 
});

//Event listner for input bar
document.getElementById("hostname").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addToStorage();
    }
});

/* Adds user specified sites into unproductive list
* Checks to ensure incoming site isn't a duplicate
*/
function addToStorage() {
    //Retrevies the input the user typed in
    var siteName = document.getElementById("hostname").value;

    var infoOfSite = {
        "url": siteName,
        "timeSpent": 0,
        "lastTimeVisited": Date.now(),
    };
    //Checks to see if the current list of unproductive tabs is empty 
    if(unpoductiveTabs == null){
        unproductiveTabs =  {};
        //The object gets a new property/attribute which is the url of the new site, the value of this attribute is the object holding this sites info
        unproductiveTabs[siteName] = infoOfSite; 
        alert("added because list is empty " + unproductiveTabs[siteName].url);
    } else if(typeof unproductiveTabs[siteName] === 'undefined'){
        unproductiveTabs[siteName] = infoOfSite;
        alert("added because this is new url " + unproductiveTabs[siteName].url);
    } else {
        alert("site was not added because it is duplicate");
    }
    //After setting the new site name, we need to update this object in chrome storage so that the values are updated across all files
    const tabTimesObjectString = JSON.stringify(unproductiveTabs);//Stringify obj to add to storage
    let newTabTimesObject = {};
    newTabTimesObject[unproductiveTabsKey] = tabTimesObjectString;
    //Replaces old unproductive list with the updated one
    chrome.storage.sync.set(newTabTimesObject, function () {
        chrome.storage.sync.get(unproductiveTabsKey, function (result) {
            alert("current unproductiveTabsList is: " + result[unproductiveTabsKey])});
    });

}