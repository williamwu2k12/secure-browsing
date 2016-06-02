define(["/app/script/datastore.js",
        "/app/script/interest.js",
        "/app/script/history.js",
        "/app/script/account.js",
        "CryptoJS.AES",
        "CryptoJS.SHA256"],
function(Datastore, Interest, History, Account) {


    /* // original
    function wrap_check(fn) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            if (!username || !password) {
                // throw new Error("No user is currently authenticated.");
                console.log("No user is currently authenticated.");
                return;
            }
            var callback;
            if (args.length > 0) {
                callback = args[args.length - 1];
            }
            if (typeof(callback) != "function") {
                args.push(function(){});
            }
            fn.apply(History, args);
        }
    }
    */


    var encrypt = function(plain_text, password) {
        return CryptoJS.AES.encrypt(plain_text, password).toString();
    }
    var decrypt = function(cipher_text, password) {
        return CryptoJS.AES.decrypt(cipher_text, password).toString(CryptoJS.enc.Utf8);
    }

    var hash = function(string) {
        return CryptoJS.SHA256(string).toString()
    }



    var check_auth = function(caller, fn, args) {
        if (!Account.auth) {
            throw new Error("No user is currently authenticated.");
            console.log("Error: no user is currently authenticated.");
            return false;
        }
        return true;
    }

    var check_callback = function(caller, fn, args) {
        var callback = undefined;
        if (args.length > 0) {
            callback = args[args.length - 1]; /* callback should be last argument */
        }
        if (typeof(callback) != "function") {
            args.push(function() {});
        }
        return true;
    }

    var wrap_check = function(fn, funcs) {
        return function() {
            var caller = this; // figure out how to grab the caller arg
            var args = Array.prototype.slice.call(arguments);
            for (var i = 0; i < funcs.length; i++) {
                if (!funcs[i](caller, fn, args)) {
                    throw new Error("Error: did not pass wrapped checks.");
                }
            }
            return fn.apply(caller, args);
        }
    }

    var Helper = {};
    Helper.wrap_check       = wrap_check;
    Helper.check_callback   = check_callback;
    Helper.check_auth       = check_auth;
    Helper.encrypt          = encrypt;
    Helper.decrypt          = decrypt;
    Helper.hash             = hash;

    return Helper;
});