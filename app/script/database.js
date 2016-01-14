define(["/app/script/datastore.js",
        "CryptoJS.AES",
        "CryptoJS.SHA256"], 

function(Datastore) {

    function Database() {

        if (Database.setup == true) {
            return;
        }
        Database.setup = true;


        var username;
        var password;
        var authenticated = false;

        var schema = 
        {
            stores: 
            [
                {
                    name: "metadata",
                    increment: false,
                    indexes: []
                },
                {
                    name: "accounts",
                    increment: false,
                    indexes: []
                }
            ]
        };

        Datastore.open(schema, function(){});
        
        var metadata    = new Datastore("metadata");
        metadata.set("sb_version", 1.0);
        metadata.set("db_version", Datastore.DB_VERSION);
        metadata.set("db_schema", schema);
        var accounts    = new Datastore("accounts");
        var links;

        Database.signin = function(name, pass, callback) {
            callback = callback != undefined ? callback : function(){};
            username = name;
            password = pass;
            accounts.get(name, null, function(value) {
                var hash_text = CryptoJS.SHA256(pass).toString();
                var exists = true;
                var matches = true;
                if (value == undefined) {
                    console.log("Error: account does not exist");
                    exists = false;
                    matches = false;
                } else if (value != hash_text) {
                    console.log("Error: password does not match");
                    matches = false;
                }
                var success = exists && matches;
                if (success) {
                    authenticated = true;
                    links = new Datastore("user." + name);
                }
                callback(success);
            });
        };

        Database.signout = function(callback) {
            callback = callback != undefined ? callback : function(){};
            username = undefined;
            password = undefined;
            authenticated = false;
            callback(true);
        };

        Database.signup = function(name, pass, callback) {
            callback = callback != undefined ? callback : function(){};
            accounts.get(name, null, function(value) {
                schema.stores.push({name: "user." + name, increment: true, indexes: ["time"]})
                Datastore.create_store(schema, function(){});

                var success = true;
                if (value == undefined) {
                    var hash_text = CryptoJS.SHA256(pass).toString();
                    accounts.set(name, hash_text);
                    callback(success);
                } else {
                    console.log("Error: account already exists");
                    success = false;
                    callback(success);
                }
            });

        };


        function encrypt(plain_text, password) {
            return CryptoJS.AES.encrypt(plain_text, password).toString();
        }
        function decrypt(cipher_text, password) {
            return CryptoJS.AES.decrypt(cipher_text, password).toString(CryptoJS.enc.Utf8);
        }


        Database.count = function(callback) {
            links.count(callback);
        }

        Database.get = function(key, index_name, callback) {
            links.get(key, index_name, function(value) {
                var plain_text = decrypt(value, password);
                if (callback != undefined) {
                    callback(plain_text);
                }
            });
        };

        Database.set = function(key, item, callback) {
            var plain_text = JSON.stringify(item);
            var cipher_text = encrypt(plain_text, password);
            if (callback != undefined) {
                links.set(key, ciphertext, callback);
            } else {
                links.set(key, ciphertext);
            }
        }

        Database.push = function(item, callback) {
            var plain_text = JSON.stringify(item);
            var cipher_text = encrypt(plain_text, password);
            if (callback != undefined) {
                links.push(cipher_text, callback);
            } else {
                links.push(cipher_text);
            }
        };

        function wrap_check(fn) {
            return function() {
                var args = Array.prototype.slice.call(arguments);
                if (!authenticated) {
                    throw new Error("No user is currently authenticated.");
                }
                var callback;
                if (args.length > 0) {
                    callback = args[args.length - 1];
                }
                if (typeof(callback) != "function") {
                    args.push(function(){});
                }
                fn.apply(Database, args);
            }
        }

        Database.count  = wrap_check(Database.count);
        Database.get    = wrap_check(Database.get);
        Database.set    = wrap_check(Database.set);
        Database.push   = wrap_check(Database.push);

    }
    Database();

    return Database;

});