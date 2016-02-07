/* handles page events, controller class */

p = function(string){console.log(string);};
require(["/app/script/model.js"],
function(SB) {

    // indexedDB.deleteDatabase("secure_browsing");

    if (window.SB == undefined) {
        window.SB = SB; // for sharing between background and popup
    }

    var DB = SB.Database;

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

        if (changeInfo.status == "complete") {

            // chrome.tabs.sendRequest(tabId, {html: true}, function(response) {
            //     console.log("got response");
            //     console.log(response);
            // });

            if (tab.url != undefined && tab.url.substring(0, 6) != "chrome") {
                link = {
                    title: tab.title,
                    url: tab.url,
                    time: new Date().getTime()
                };
                DB.push(link);
            }
        }
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        var src_protocol = request.protocol;
        var src_html = request.html;
        var chosen = request.chosen;
        SB.Database.train(src_protocol, src_html, chosen, function() {});
    });

});