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