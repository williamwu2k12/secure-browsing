/***************************
**  Variable Declaration  **
***************************/

/**
* @purpose: establish fixed references
* @param: StorageArea: access to chrome local storage in 00003.log
* @param: tabsets: dictionary of previous links, to check whether link has changed, also acts as tabset
**/
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
    if (changeInfo.url != undefined && changeInfo.url.substring(0, 6) != "chrome")
    {
        tabsets[tab.windowId][tabId].push(changeInfo.url);
        storeUrl(tab.title, changeInfo.url, null, tab.incognito);
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




function initialize()
{
    chrome.storage.local.get("username", function(object)
    {
        if (object["username"] == undefined)
        {
            chrome.storage.local.set({username: ""});
        }
    });
    chrome.storage.local.get("password", function(object)
    {
        if (object["password"] == undefined)
        {
            chrome.storage.local.set({password: ""});
        }
    });
    chrome.storage.local.get("keys", function(object)
    {
        if (object["keys"] == undefined)
        {
            object["keys"] = [];
            chrome.storage.local.set(object);
        }
    });
    chrome.storage.local.get("accounts", function(object)
    {
        if (object["accounts"] == undefined)
        {
            object["accounts"] = {};
            chrome.storage.local.set(object);
        }
    });
}

initialize();