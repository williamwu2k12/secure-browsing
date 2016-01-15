/* handles page events, controller class */

p = function(string){console.log(string);};
require(["/app/script/model.js"],
function(SB) {

    username = "kevin";
    password = "pass";

    var DB = SB.Database;
    DB.signin(username, password, function(success) {
        if (success == true) {
            init_listeners();
        } else {
            // tell user to reenter password
            DB.signup(username, password, function(success) {
                console.log(success)
                if (success == true) {
                    DB.signin(username, password, function(success) {
                        if (success == true) {
                            init_listeners();
                        } else {
                            throw new Error("Can not sign in");
                        }
                    });
                } else {
                    throw new Error("Can not sign up");
                }
            });
        }
    });

    function init_listeners() {
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
            if (changeInfo.url != undefined && changeInfo.url.substring(0, 6) != "chrome") {
                link = {title: tab.title, url: changeInfo.url, time: new Date().getTime()};
                DB.push(link);
            }
        });
    }

});