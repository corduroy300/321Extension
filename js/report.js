// Creates table on DOM load
document.addEventListener(
    "DOMContentLoaded",
    function () {
        populateList();
    },
    false
);

const unproductiveTabsKey = "unproductiveTabs";
var unproductiveTabs;

var list = [
    /*{ "Website": "filler.com", "Time spent": "60 mins" },
    { "Website": "filler2.com", "Time spent": "60 mins" },
    { "Website": "filler3.com", "Time spent": "60 mins" },*/
];

function populateList(){
    chrome.storage.sync.get(unproductiveTabsKey, function (result) {
        let listOfUnproductiveTabs = result[unproductiveTabsKey];
        //alert(listOfUnproductiveTabs);

        if (listOfUnproductiveTabs != null) {
            unproductiveTabs = JSON.parse(listOfUnproductiveTabs);
            //alert(unproductiveTabs['www.google.com'].url);
        } 

        var index = 0;
        for (const [key, value] of Object.entries(unproductiveTabs)) {
            
            var objForList = {};
            objForList["Website"] = value.url;
            objForList["Time Spent (minutes)"] = "" + timeConversion(value.timeSpent);

            list[index] = objForList;
            index++;
        }

        //alert(JSON.stringify(list));
        GENERATE_REPORT();

    });

}//end of populateList

function timeConversion(seconds){
    return seconds/60.0; 
}

function GENERATE_REPORT() {
    var cols = [];

    for (var i = 0; i < list.length; i++) {
        for (var k in list[i]) {
            if (cols.indexOf(k) === -1) {
                // Push all keys to the array
                cols.push(k);
            }
        }
    }

    // Create a table element
    var table = document.createElement("table");

    // Create table row tr element of a table
    var tr = table.insertRow(-1);

    for (var i = 0; i < cols.length; i++) {
        // Create the table header th element
        var theader = document.createElement("th");
        theader.innerHTML = cols[i];

        // Append columnName to the table row
        tr.appendChild(theader);
    }

    // Adding the data to the table
    for (var i = 0; i < list.length; i++) {
        // Create a new row
        trow = table.insertRow(-1);
        for (var j = 0; j < cols.length; j++) {
            var cell = trow.insertCell(-1);

            // Inserting the cell at particular place
            cell.innerHTML = list[i][cols[j]];
        }
    }

    // Add the newely created table containing json data
    var el = document.getElementById("table");
    el.innerHTML = "";
    el.appendChild(table);
}

// Chart code
var labels = [];
var data = {
    labels: labels,
    datasets: [
        {
            label: "Time spent on unproductive websites",
            backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
            data: [],
        },
    ],
};

function populateChart(){
    chrome.storage.sync.get(unproductiveTabsKey, function (result) {
        let listOfUnproductiveTabs = result[unproductiveTabsKey];
        //alert(listOfUnproductiveTabs);

        if (listOfUnproductiveTabs != null) {
            unproductiveTabs = JSON.parse(listOfUnproductiveTabs);
            //alert(unproductiveTabs['www.google.com'].url);
        } 

        var index = 0;
        for (const [key, value] of Object.entries(unproductiveTabs)) {
            labels[index] = value.url;
            data.datasets[0].data[index] = timeConversion(value.timeSpent);
            index++;
        }
    });
}

var config = {
    type: "pie",
    data,
    options: {},
};

populateChart();

var myChart = new Chart(document.getElementById("myChart"), config);
