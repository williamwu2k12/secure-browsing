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
        if (changeInfo.url != undefined && changeInfo.url.substring(0, 6) != "chrome") {
            link = {title: tab.title, url: changeInfo.url, time: new Date().getTime()};
            DB.push(link);
        }
    });

});