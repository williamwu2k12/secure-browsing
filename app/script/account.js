define(["/app/script/datastore.js",
        "/app/script/interest.js",
        "/app/script/network.js",
        "/app/script/history.js",
        "/app/script/helper.js"],

function(Datastore, Interest, Network, History, Helper) {

    function Account(username, password) {

        function init_class() {
            if (Account.setup == true) {
                return;
            }

            Account.ds_name = "accounts";
            Account.schema = {stores: []};
            Account.schema.stores.push({name: Account.ds_name,
                                        increment: false,
                                        indexes: []});
            Datastore.open(Account.schema, function() {});
            
            // var metadata    = new Datastore("metadata");
            // metadata.set("sb_version", 1.0);
            // metadata.set("db_version", Datastore.DB_VERSION);
            // metadata.set("db_schema", Account.schema);

            Account.ds      = new Datastore(Account.ds_name);
            Account.user    = undefined;
            Account.auth    = false;
            Account.setup   = true;
        }

        function init(self) {
            if (!username || !password) {
                return;
            }

            self.username   = username;
            self.password   = password;

            self.history    = new History(self.username, self.username, self.password);
            self.interest   = new Interest(self.username);
        }

        init_class();
        init(this);
    }

    /*
      @purpose: Sign ins with a username and password.
      @param: <String> name: the username
      @param: <String> pass: the password
      @param: <Function> callback(<Boolean> success): function called after the signin has completed
        <Boolean> success: boolean indicating whether or not the signin succeeded
      @note: signin will fail if the account does not currently exist, or if the username and password do not match
      @note: need to implement if a user is already signed in
      @examples:
        Account.signin("user0", "pass_phrase", function(success) {
            if (success == true) {
                console.log("user successfully signed in");
            }
        });
    */
    Account.signin = function(username, password, callback) {
        callback = callback != undefined ? callback : function(){};
        Account.ds.get(username, null, function(value) {
            var hash_text = Helper.hash(password);
            var success = true;
            if (value == undefined) {
                console.log("Error: account does not exist");
                success = false;
            } else if (value != hash_text) {
                console.log("Error: password does not match");
                success = false;
            }
            if (success) {
                Account.signout();
                Account.user = new Account(username, password);
                Account.auth = true;
            }
            callback(success);
        });
    };

    /*
      @purpose: Signs out the current authenticated user, if there is one.
      @param: <Function> callback(<Boolean> success): function called after the signout has completed
        @param: <Boolean> success: boolean indicating whether or not the signout succeeded
      @note: in its current implementation, signout will always succeed
      @examples:
        Account.signout(function(success) {
            if (success == true) {
                console.log("user successfully signed out");
            }
        });
    */
    Account.signout = function(callback) {
        callback = callback != undefined ? callback : function(){};
        var user = Account.user;
        if (Account.auth) {
            user.username = undefined;
            user.password = undefined;
            user.history.username = undefined;
            user.history.password = undefined;
        }
        Account.user = undefined;
        Account.auth = false;
        callback(true);
    };

    /*
      @purpose: Signs up a new user, if the user does not already exist.
      @param: <String> name: the username
      @param: <String> pass: the password
      @param: <Function> callback(<Boolean> success): function called after the signup has completed
        @param: <Boolean> success: boolean indicating whether or not the signup succeeded
      @note: signup will fail if the account already exists
      @examples:
        Account.signup(function(success) {
            if (success == true) {
                console.log("user successfully signed up");
            }
        });
    */
    Account.signup = function(username, password, callback) {
        callback = callback != undefined ? callback : function(){};
        Account.ds.get(username, null, function(value) {
            Account.schema.stores.push({name: History.ds_name + "." + username,
                                        increment: true,
                                        indexes: ["time"]});
            Account.schema.stores.push({name: Network.ds_name + "." + username,
                                        increment: false,
                                        indexes: []});
            Datastore.create_store(Account.schema, function(){});

            if (value == undefined) {
                var hash_text = Helper.hash(password);
                Account.ds.set(username, hash_text, function(evt) {
                    if (evt.returnValue == true) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            } else {
                console.log("Error: account already exists");
                callback(false);
            }
        });
    };

    Account(); /* initialize */
    
    return Account;
});