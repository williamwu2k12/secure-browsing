chrome.extension.onMessage.addListener(function(request, sender)
{
    console.log("background receives message from content script");
    var message = processMessage(request.message);
    returnMessage(message);
})

function processMessage(msg)
{
    if (true)
    {
        console.log("background processes message");
    }
    return msg;
}

function returnMessage(msg)
{
    chrome.tabs.getSelected(null, function(tab)
    {
        console.log("background sends message to content script");
        chrome.tabs.sendMessage(tab.id, {message: msg});
    })
}