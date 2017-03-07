/* the model file handles object storage */
/* **************************************************
   main Secure Browsing module meant to handle
   storage, algorithms, and misc. (needs to be
   remodularized, renamed, and soemwhat rewritten)
   ************************************************** */

var CLOG = true;
p = function(string) {
    if (CLOG) {
        console.log(string);
    }
};
require.config({
    "paths": {
        "CryptoJS.AES": "/app/script/lib/cryptojs/rollups/aes",
        "CryptoJS.SHA256": "/app/script/lib/cryptojs/rollups/sha256"
    },
    "shims": {
        "CryptoJS.AES": "CryptoJS",
        "CryptoJS.SHA256": "CryptoJS"
    }
});

define(["/app/script/datastore.js",
        "/app/script/account.js",
        "/app/script/history.js",
        "/app/script/interest.js",
        "/app/script/helper.js",
        "/app/test/test.js"],

function(Datastore, Account, History, Interest, Helper, Test) {

    /* do any initial database setup */

    var SB = {};
    SB.Datastore    = Datastore;
    SB.Account      = Account;
    SB.History      = History;
    SB.Interest     = Interest;
    SB.Helper       = Helper;
    SB.Test         = {};

    return SB;

});
