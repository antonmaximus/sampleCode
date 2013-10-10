// Author: Anton Agana
// 
// INFO: This JavaScript file will issue a GET request  to the server when there's 
// at least 3 characters placed in the input field.  If you need to change the URL path for the GET request
//  you can update the "url" variable in the "issueGet" function. 
//
//  This script will process JSON data and it will also process a JSONP format.
//
//   Furthermore, the server is expected to return results that correctly match the input key.  Hence, parsing for matches
//   will not be done on the client-side.    
//
/*global document: false */




//Clear <li> items.
function clearItems() {
    var ul = document.getElementById("result");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild); //this also removes any event listeners
    }
    document.getElementById("result").style.display = "none";
}

// Handle clicked <li>
function itemSelection(e) {
    var clickedItem = e.target.innerHTML;
    document.getElementById("characterName").value = clickedItem;
    clearItems();
}


//Update <li> items.    
function updateItems(searchResults) {
    var ul, i, item;
    ul = document.getElementById("result");
    for (i = 0;  i < searchResults.length; i += 1) {
        item = document.createElement("li");
        item.innerHTML = searchResults[i];
        item.addEventListener("click", itemSelection, false);
        ul.appendChild(item);
    }
    if (searchResults.length > 0) {
        document.getElementById("result").style.display = "block";
    }
}

function qualifyData(jsonObj) { 
    var searchResults, i;
    searchResults = [];
        
    //This for-loop loads the JSON data to an array.
    for (i = 0; i < jsonObj.data.length; i += 1) {
        searchResults.push(jsonObj.data[i].fullname);  //Title Case
    }
    clearItems();
    updateItems(searchResults);
}

function issueGet() {  //We issue a GET request if there's 3 or more characters only.
    var key, callbackName, parameters, url, text, injectScript, jsonObj, ul, li;
    key = document.getElementById("characterName").value;
    if (key.length < 3) {
        clearItems();
    } else { 
        callbackName = "qualifyData";
        parameters = "?input=" + key + "&callback=" + callbackName + "&t=" + Math.random(); //math is to avoid cached info
        url = "serverSideParser.php" + parameters;
        var xmlhttp = new XMLHttpRequest();        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp.open("GET", url, true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    text = xmlhttp.responseText;
                    //console.log(text); 
                    if (text.indexOf(callbackName) > -1) { //If the Server wrapped the JSON data with the callback (i.e., JSONP)
                        injectScript  = document.createElement("script");
                        injectScript.type = "text/javascript";
                        injectScript.text = text;
                        document.getElementsByTagName("head")[0].appendChild(injectScript);  // add it to the <HEAD> to inject the script
                    } else { //The server just gave us JSON and we need to call the callback function manually
                        jsonObj = eval('(' + text + ')');  //Using eval instead of JSON.parse because the server will return a non-standard JSON
                        qualifyData(jsonObj);
                    }
                } else {//The server error'ed out (e.g., status 404)
                    text = ["\"Data Not Available\""];
                    clearItems();
                    updateItems(text);
                    //Make item Un-Clickable
                    ul = document.getElementById("result"); 
                    li = ul.getElementsByTagName('li');
                    li[0].style.cursor = "default"; 
                    li[0].style.background = "none"; 
                    li[0].removeEventListener('click', itemSelection, false);
                }   
            }
        }
        xmlhttp.send();
    }
}

var timer; 
function userIsTyping() {   //Delay the request if the user is continuously typing
    if (timer){
        clearTimeout(timer);
    }
    timer = setTimeout(issueGet, 250);  //1000 is 1 sec    
}


// add event listener to input field
var inputListener = document.getElementById("characterName");
inputListener.addEventListener("keyup", userIsTyping, false);
