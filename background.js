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
var prevhref = {};



/***********************
**  Helper Functions  **
***********************/

/**
* function deliverMessage(msg)
* @purpose: delivers message to the tab that made original request
* @param: msg: message being delivered
**/
function deliverMessage(msg)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        chrome.tabs.sendMessage(tabs[0].id, {message: msg});
    })
}



/****************
**  Listeners  **
****************/

/**
* @purpose: delivers message on tab updated
* @note: if no change, then changeInfo.url == undefined
* @note: changeInfo.url grabs url of page that doesn't reload
**/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
    if (changeInfo.url != undefined)
    {
        prevhref[tabId].push(changeInfo.url);
        storeUrl(changeInfo.url);
    }
})
/**
* deprecated method
**/
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
// {
//     deliverMessage(tab.url);
// })

/**
* @purpose: makes a new array in the prevhref, a tabset
**/
chrome.tabs.onCreated.addListener(function(tab)
{
    prevhref[tab.id] = [];
})

/**
* @purpose: marks the tab as finished
* @note: does not actually remove the dictionary entry (use remove to do so)
* @note: implement saving to localStorage later (not chrome.storage.local)
**/
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo)
{
    prevhref[tabId].push(null);
})


/****************
**  Debugging  **
****************/

/**
* function clearStorage()
* @purpose: deletes all items in storage area
**/
function clearStorage()
{
    chrome.storage.local.clear();
}

/**
* function printStorage()
* @purpose: prints the current state of the storage, decrypted
**/
function printStorage()
{
    chrome.storage.local.get(null, function(objects)
    {
        var allkeys = Object.keys(objects);
        var allobjects = objects;
        // console.log(allobjects);
        for (var key in allobjects)
        {
            if (allobjects.hasOwnProperty(key))
            {
                console.log(decrypt(key) + ": " + decrypt(allobjects[key]));
            }
        }
    });
};