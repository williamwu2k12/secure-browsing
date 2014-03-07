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
    deliverMessage(tab.url);
})