/* the model file handles object storage */

p = function(string){console.log(string);};
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

define(["/app/script/database.js"], function(Database) {

    /* do any initial database setup */

    var SB = {};
    SB.Database = Database;

    var DB = Database;
    if (window.SB == undefined) {
        window.SB = SB; // for testing purposes
    }


    return SB;

});
