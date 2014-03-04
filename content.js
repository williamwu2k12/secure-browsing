//////////////////////////
// Variable Declaration //
//////////////////////////

var StorageArea = chrome.storage.local;
var cipher = setupCipher();



//////////////////////////////
// Loading External Scripts //
//////////////////////////////

// var fetch = document.createElement("script");
// fetch.src = chrome.extension.getURL("fetch.js");
// fetch.onload = function(){this.parentNode.removeChild(this);};
// (document.head || document.documentElement).appendChild(fetch);
// var storage = document.createElement("script");
// storage.src = chrome.extension.getURL("storage.js");
// storage.onload = function(){this.parentNode.removeChild(this);};
// (document.head || document.documentElement).appendChild(storage);



////////////////////////////
// Adding Inline Function //
////////////////////////////

var code = '(' + function()
{
    console.log("new tab opened");
} + ')();';
var script = document.createElement("script");
script.textContent = code;
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);



//////////////////////////////
// Listeners for Background //
//////////////////////////////

chrome.runtime.onMessage.addListener(function(request, sender)
{
    console.log("content script receives message from background");
})

function sendMessage(msg)
{
    chrome.extension.sendMessage({message: msg});
}

window.onload = function()
{
    storeTab();
}



/////////////////////////
// Main Code Execution //
/////////////////////////

// StorageArea.clear(function(){});
// store("1", new link("http://www.google.com/"));
// store("2", new link("http://www.facebook.com/"));
// store("3", new link("http://www.imgur.com/"));
// store("4", new link("http://www.reddit.com/"));
// store("5", new link("http://www.cs.berkeley.edu/"));
// store("6", new link("http://www.stackoverflow.com/"));
// store("7", new link("http://www.ycombinator.com/"));
// store("8", new link("http://www.piazza.com/"));
// store("9", new link("http://bearfacts.berkeley.edu/"));
// store("10", new link("http://calbears.imtrackonline.com/"));
// for (i = 1; i < 11; i++)
// {
//     get(i + "");
// }



///////////////////////////
// Example Key Detection //
///////////////////////////

// if (window == top)
// {
//     window.addEventListener("keyup", function(event)
//     {
//         if (event.keyCode == 90) // if key pressed is z
//         {
//             sendMessage("testing message sending");
//         }
//     }, false);
// }