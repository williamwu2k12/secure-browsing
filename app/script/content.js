/* **************************************************
   content script that runs on every tab (remember to
   minimize code amount and effect since this script
   scales linearly) and connects with the background
   script, sending html and other page info
   ************************************************** */


/* NOTE: when making changes to this file, make sure
   to fully refresh chrome extension, otherwise the
   changes won't take effect */

/* @purpose: handle all clicks away from the current
   page, html and other content is captured at time
   of click (to avoid dynamic page async javascript,
   which needs time to load) */
var update_handler = function(evt) {
    // evt.preventDefault(); // for debugging
    // var evt = window.e || evt;
    // var element = evt.target != undefined ? evt.target : evt.srcElement;

    /* TODO: javascript allows modification of onclicks
       for any element, figure out how to resolve click
       events on non link (<a></a>) elements, for now
       temporarily ignore non link elements */
    // if (evt.target.tagName.toLowerCase() != "a") {
    //     return;
    // }

    /* Grab information about the clicked element and the
       source html at moment of leaving the page 
       T0: traverse to page P0
       T1: click link Lx on P0 that leads to P1, classify
           P0 as an interesting link, classify all pages
           pointed to by Ly on P0 where Lx != Ly as
           uninteresting links
       T2: click link La on P1 that leads to P2, classify
           P1 as an interesting link, classify all pages
           pointed to by Lb on P1 where Lb != La as
           uninteresting links */
    var obj = {
        /* paste: """document.addEventListener("click",
                     function(evt) {evt.preventDefault();
                                    p(evt);});""" */
        "protocol":     location.protocol,
        "html":         document.documentElement.innerHTML,
        "location":     location.href /* https://developer.mozilla.org/en-US/docs/Web/API/Window/location */

        "elem_href":    evt.target.href,
        "elem_tag":     evt.target.tagName,
        "elem_html":    document.activeElement.outerHTML, /* last clicked elem */
    };
    chrome.runtime.sendMessage(obj, function(response) {});
}

if (window.addEventListener) { /* document vs window, beforeunload vs click */
    window.addEventListener("beforeunload", update_handler)
} else {
    window.attachEvent("beforeunload", update_handler)
}