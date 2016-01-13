define(["/app/script/datastore.js",
        "CryptoJS.AES",
        "CryptoJS.SHA256"], 

function(Datastore) {

    function Database(username, password) {

        if (username == undefined || password == undefined) {
            throw new Error("Arguments missing");
        }

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
                },
                {
                    name: "user." + username,
                    increment: true,
                    indexes: ["time"]
                }
            ]
        };


        Datastore().open(schema);
        
        var metadata    = new Datastore("metadata");
        metadata.set("sb_version", 1.0);
        metadata.set("db_version", Datastore.DB_VERSION);
        metadata.set("db_schema", schema);

        var accounts    = new Datastore("accounts");
        var links       = new Datastore("user." + username);

        this.signin = function(callback) {
            accounts.get(username, null, function(value) {
                var hash_text = CryptoJS.SHA256(password).toString();
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
                callback(success);
            });
        };

        this.signout = function(callback) {
            password = undefined;
            callback(true);
        };

        this.signup = function(callback) {
            accounts.get(username, null, function(value) {
                var success = true
                if (value == undefined) {
                    var hash_text = CryptoJS.SHA256(password).toString();
                    accounts.set(username, hash_text, callback);
                } else {
                    console.log("Error: account already exists");
                    success = false;
                    callback(success);
                }
            });

        };

        function wrap_callback(fn) {
            return function() {
                if (arguments.length == 0) {
                    fn.apply(self, [function(){}]);
                } else {
                    fn.apply(self, arguments);
                }
            };
        }
        this.signup = wrap_callback(this.signup);
        this.signin = wrap_callback(this.signin);
        this.signout = wrap_callback(this.signout);


        function encrypt(plain_text, pass) {
            return CryptoJS.AES.encrypt(plain_text, pass).toString();
        }
        function decrypt(cipher_text, pass) {
            return CryptoJS.AES.decrypt(cipher_text, pass).toString(CryptoJS.enc.Utf8);
        }


        this.count = function(callback) {
            links.count(callback);
        }

        this.get = function(key, index_name, callback) {
            links.get(key, index_name, function(value) {
                var plain_text = decrypt(value, password);
                if (callback != undefined) {
                    callback(plain_text);
                }
            });
        };

        this.set = function(key, item, callback) {
            var plain_text = JSON.stringify(item);
            var cipher_text = encrypt(plain_text, password);
            if (callback != undefined) {
                links.set(key, ciphertext, callback);
            } else {
                links.set(key, ciphertext);
            }
        }

        this.push = function(item, callback) {
            var plain_text = JSON.stringify(item);
            var cipher_text = encrypt(plain_text, password);
            if (callback != undefined) {
                links.push(cipher_text, callback);
            } else {
                links.push(cipher_text);
            }
        };

    }

    return Database;

});