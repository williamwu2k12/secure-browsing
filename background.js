/***************************
**  Variable Declaration  **
***************************/

/**
* @purpose: establish fixed references
* @param: StorageArea: access to chrome local storage in 00003.log
* @param: cipher: precomputed substitution cipher (later replaced by RSA)
* @param: tabsets: dictionary of previous links, to check whether link has changed, also acts as tabset
**/
var StorageArea = chrome.storage.local;
var cipher = { '0': 't', '1': 'S', '2': ' ', '3': 'm', '4': '9', '5': 'L', '6': 'h', '7': 'q', '8': 'B', '9': '4', u: 'd', d: 'u', '<': 'W', W: '<', m: '3', '$': '(', '(': '$', ' ': '2', B: '8', Q: '#', '#': 'Q', '[': ',', ',': '[', N: '\'', '\'': 'N', v: 'O', O: 'v', s: '?', '?': 's', ')': '`', '`': ')', '>': '}', '}': '>', q: '7', E: 'Z', Z: 'E', H: 'V', V: 'H', '.': '|', '|': '.', S: '1', D: 'y', y: 'D', n: '^', '^': 'n', '&': ':', ':': '&', J: '_', _: 'J', K: 'b', b: 'K', c: 'g', g: 'c', X: 'f', f: 'X', T: '-', '-': 'T', h: '6', r: '/', '/': 'r', '*': 'k', k: '*', M: '%', '%': 'M', I: 'i', i: 'I', '+': 'p', p: '+', R: ';', ';': 'R', j: 'l', l: 'j', U: 'w', w: 'U', '~': 'z', z: '~', t: '0', L: '5', ']': '=', '=': ']', '{': 'F', F: '{', e: 'P', P: 'e', '"': 'a', a: '"', o: 'x', x: 'o', '@': 'Y', Y: '@', '\\': 'G', G: '\\', C: '', '': 'C', '!': 'A', A: '!' };
var tabsets = {};



/****************
**  Listeners  **
****************/

/**
* @purpose: delivers message on tab updated
* @note: if no change, then changeInfo.url == undefined
* @note: changeInfo.url grabs url of page that doesn't reload
* @note: not sure if good idea to create new arrays from uncreated windows/tabs
* @note: currently a bug where onupdated should detect when tab removed and add the appropriate url, but doesn't
**/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
    if (tabsets[tab.windowId] == undefined)
    {
        tabsets[tab.windowId] = {};
    }
    if (tabsets[tab.windowId][tabId] == undefined)
    {
        tabsets[tab.windowId][tabId] = [];
    }
    if (changeInfo.url != undefined)
    {
        tabsets[tab.windowId][tabId].push(changeInfo.url);
        storeUrl(changeInfo.url, null, tab.incognito);
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
* @purpose: makes a new array in the tabsets, a tabset
**/
chrome.tabs.onCreated.addListener(function(tab)
{
    if (tabsets[tab.windowId] == undefined)
    {
        tabsets[tab.windowId] = {};
    }
    tabsets[tab.windowId][tab.id] = [];
})

/**
* @purpose: marks the tab as finished
* @note: does not actually remove the dictionary entry (use remove to do so)
* @note: implement saving to localStorage later (not chrome.storage.local)
**/
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo)
{
    if (tabsets[removeInfo.windowId] == undefined)
    {
        tabsets[removeInfo.windowId] = {};
    }
    if (tabsets[removeInfo.windowId][tabId] == undefined)
    {
        tabsets[removeInfo.windowId][tabId] = [];
    }
    tabsets[removeInfo.windowId][tabId].push(null);
})

/**
* @purpose: creates new dictionary with the window id as the key
**/
chrome.windows.onCreated.addListener(function(window)
{
    tabsets[window.id] = {};
})

/**
* @purpose: sets the null dictionary key to null and adds to local storage
* @note: localStorage is still problematic, only 5mb, figure out a way to do long term storage
**/
chrome.windows.onRemoved.addListener(function(windowId)
{
    if (tabsets[windowId] == undefined)
    {
        tabsets[windowId] = {};
    }
    tabsets[windowId][null] = null;
    var today = new Date();
    localStorage.setItem(convertDate(), JSON.stringify({windowId: tabsets[windowId]}));
})



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

/**
* function checkWindowTab()
* @purpose: check whether there is a window or tab
* @note: creates new empty dictionaries if no window or tab
* @note: should use, but something wrong so the functions are hardcoded
**/
function checkWindowTab(windowId, tabId)
{
    if (tabsets[windowId] == undefined)
    {
        tabsets[windowId] = {};
    }
    if (tabsets[windowId][tabId] == undefined)
    {
        tabsets[windowId][tabId] = [];
    }
}