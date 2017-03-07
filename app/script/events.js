/* **************************************************
   background script, acts as controller and handles
   changes in tabs, such as any click events passed
   from content scripts or tab url updates; currently
   saves history and trains neural net
   ************************************************** */

require(["/app/script/model.js"],
function(SB) {
    // indexedDB.deleteDatabase("secure_browsing");
    if (window.SB == undefined) {
        window.SB = SB; // for sharing between background and popup
    }

    /* processes tabs that have been updated, immediately
       adding the new url to encrypted history store */
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        /* ensure that tab has finished updating and that the
           url is valid (defined and not a chrome url) */
        if (changeInfo.status == "complete" &&
            tab.url != undefined &&
            tab.url.substring(0, 6) != "chrome") {
            var link = {
                title: tab.title,
                url: tab.url,
                time: new Date().getTime()
            };
            if (SB.Account.auth) {
                SB.Account.user.history.push(link);
            }
        }
    });

    /* processes a tab whose content script just sent the
       corresponding html and clicked element data, to be
       trained on by the neural net */
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        var src_protocol    = request.protocol;
        var src_html        = request.html;
        var elem_href       = request.elem_href;
        var elem_tag        = request.elem_tag;
        var elem_html       = request.elem_html;

        var location        = request.location;

        if (SB.Account.auth) {
            SB.Account.user.interest.train(src_html, src_protocol, elem_html, location);
        }
    });

});