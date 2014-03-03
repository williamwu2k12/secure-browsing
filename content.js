// alert("Every time a new tab is opened, a new document is created in which this script is ran. This is the alert.");
var code = '(' + function() {
    console.log("Every time a new tab is opened, a new document is created in which this script is ran. This is the console log.");
    chrome.extension.isAllowedIncognitoAccess(function(isAllowedAccess)
    {
        console.log(isAllowedAccess);
    });
} + ')();';
var script = document.createElement('script');
script.textContent = code;
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);

chrome.runtime.onMessage.addListener(function(request, sender)
{
    console.log("content script receives message from background");
})

function sendMessage(msg)
{
    chrome.extension.sendMessage({message: msg});
}

if (window == top)
{
    window.addEventListener("keyup", function(event)
    {
        if (event.keyCode == 90)
        {
            sendMessage("testing message sending");
        }
    }, false);
}