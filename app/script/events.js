/* handles page events, controller class */

p = function(string){console.log(string);};
// require(["/app/script/model.js"]
// function() {
//     (function() {

//     })();
// });
// );

require(["/app/script/model.js"],
function(SB) {

    username = "will";
    password = "pass";

    var db = new SB.Database(username, password);
    db.signin(function(success){
        if (!success) {
            // tell user to reenter password
            db.signup(function(success) {
                if (success != false) {
                    console.log("yay");
                }
            });
        }
    });

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.url != undefined && changeInfo.url.substring(0, 6) != "chrome") {
            link = {title: tab.title, url: changeInfo.url, time: new Date().getTime()};
            db.push(link);
        }
    });
});