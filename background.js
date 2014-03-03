chrome.extension.onRequest.addListener(function(request, sender)
{
    console.log("background receives message from content script");
    var message = processMessage(request.message);
    returnMessage(message);
})

function processMessage(message)
{
    if (true)
    {
        console.log("background processes message");
    }
    return message;
}

function returnMessage(message)
{
    chrome.tabs.getSelected(null, function(tab)
    {
        chrome.tabs.sendMessage(tab.id);
    })
}