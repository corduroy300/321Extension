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
            objForList["Time Spent"] = "" + value.timeSpent;

            list[index] = objForList;
            index++;
        }

        //alert(JSON.stringify(list));
        GENERATE_REPORT();

    });

}//end of populateList

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
const labels = ["January", "February", "March", "April", "May", "June"];
const data = {
    labels: labels,
    datasets: [
        {
            label: "Time spent on unproductive websites",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: [0, 10, 5, 2, 20, 30, 45],
        },
    ],
};

const config = {
    type: "line",
    data,
    options: {},
};

var myChart = new Chart(document.getElementById("myChart"), config);
