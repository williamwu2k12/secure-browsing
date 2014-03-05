//////////////////////////
// Variable Declaration //
//////////////////////////

var StorageArea = chrome.storage.local;
var cipher = { '0': 't', '1': 'S', '2': ' ', '3': 'm', '4': '9', '5': 'L', '6': 'h', '7': 'q', '8': 'B', '9': '4', u: 'd', d: 'u', '<': 'W', W: '<', m: '3', '$': '(', '(': '$', ' ': '2', B: '8', Q: '#', '#': 'Q', '[': ',', ',': '[', N: '\'', '\'': 'N', v: 'O', O: 'v', s: '?', '?': 's', ')': '`', '`': ')', '>': '}', '}': '>', q: '7', E: 'Z', Z: 'E', H: 'V', V: 'H', '.': '|', '|': '.', S: '1', D: 'y', y: 'D', n: '^', '^': 'n', '&': ':', ':': '&', J: '_', _: 'J', K: 'b', b: 'K', c: 'g', g: 'c', X: 'f', f: 'X', T: '-', '-': 'T', h: '6', r: '/', '/': 'r', '*': 'k', k: '*', M: '%', '%': 'M', I: 'i', i: 'I', '+': 'p', p: '+', R: ';', ';': 'R', j: 'l', l: 'j', U: 'w', w: 'U', '~': 'z', z: '~', t: '0', L: '5', ']': '=', '=': ']', '{': 'F', F: '{', e: 'P', P: 'e', '"': 'a', a: '"', o: 'x', x: 'o', '@': 'Y', Y: '@', '\\': 'G', G: '\\', C: '', '': 'C', '!': 'A', A: '!' };



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

window.onclose = function()
{

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