// chrome.runtime.onMessage.addListener(
// function(request, sender, sendResponse) {
//     response = document.all[0].outerHTML;
//     sendResponse(response);
//     return true;
// });

var click_handler = function(evt) {
    var evt = window.e || evt;
    var element = evt.target != undefined ? evt.target : evt.srcElement;
    // evt.preventDefault(); // for debugging
    if (evt.target.tagName.toLowerCase() != "a") {
        return;
    }
    document.documentElement.innerHTML;
    var obj = {
        "protocol": location.protocol,
        "html": document.documentElement.innerHTML,
        "chosen": element,
        "event": evt.target
    };
    chrome.runtime.sendMessage(obj, function(response) {});
}
if (document.addEventListener) {
    document.addEventListener("click", click_handler, false);
} else {
    document.attachEvent("onclick", click_handler);
}