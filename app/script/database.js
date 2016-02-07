define(["/app/script/datastore.js",
        "CryptoJS.AES",
        "CryptoJS.SHA256",
        "/app/script/lib/brain/brain-0.6.3.js",
        "/app/script/lib/convnetjs/convnet.js"], 

function(Datastore) {

    function Database() {

        // var net = new brain.NeuralNetwork();

        // var data = [{input: [0, 0], output: [0]},
        //     {input: [0, 1], output: [1]},
        //     {input: [1, 0], output: [1]},
        //     {input: [1, 1], output: [0]}]

        // net.train(data);

        // console.log(net.run([0, 0]));




        if (Database.setup == true) {
            return;
        }
        Database.setup = true;


        var username;
        var password;
        Database.auth = false;

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

        Datastore.open(schema, function() {});
        
        var metadata    = new Datastore("metadata");
        metadata.set("sb_version", 1.0);
        metadata.set("db_version", Datastore.DB_VERSION);
        metadata.set("db_schema", schema);
        var accounts    = new Datastore("accounts");
        var history;
        var network;

        /*
          @purpose: Sign ins with a username and password.
          @param: <String> name: the username
          @param: <String> pass: the password
          @param: <Function> callback(<Boolean> success): function called after the signin has completed
            <Boolean> success: boolean indicating whether or not the signin succeeded
          @note: signin will fail if the account does not currently exist, or if the username and password do not match
          @note: need to implement if a user is already signed in
          @examples:
            Database.signin("user0", "pass_phrase", function(success) {
                if (success == true) {
                    console.log("user successfully signed in");
                }
            });
        */
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
                    Database.auth = true;
                    history = new Datastore("history." + name);
                    network = new Datastore("network." + name);
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
            Database.signout(function(success) {
                if (success == true) {
                    console.log("user successfully signed out");
                }
            });
        */
        Database.signout = function(callback) {
            callback = callback != undefined ? callback : function(){};
            username = undefined;
            password = undefined;
            Database.auth = false;
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
            Database.signup(function(success) {
                if (success == true) {
                    console.log("user successfully signed up");
                }
            });
        */
        Database.signup = function(name, pass, callback) {
            callback = callback != undefined ? callback : function(){};
            accounts.get(name, null, function(value) {
                schema.stores.push({name: "history." + name, increment: true, indexes: ["time"]})
                Datastore.create_store(schema, function(){});

                if (value == undefined) {
                    var hash_text = CryptoJS.SHA256(pass).toString();
                    accounts.set(name, hash_text, function(evt) {
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


        Database.train = function(src_protocol, src_html, chosen, callback) {
            var doc = document.createElement("html");
            doc.innerHTML = html;
            var links = doc.getElementsByTagName("a");
            window.links = links;
            var link;

            return;

            for (var k = 0; k < links.length; k++) {
                link = links[k];
                var xml_req = new XMLHttpRequest();
                xml_req.onreadystatechange = function() {
                    if (xml_req.readyState == 4 && xml_req.status == 200) {
                        var response = xml_req.responseText;
                        var html = document.createElement("html");
                        html.innerHTML = response;
                        var i = 0;
                        while (i < html.children.length) {
                            if (html.children[i].tagName.toLowerCase() == "head") {
                                html.children[i].remove();
                                i -= 1;
                            }
                            i += 1;
                        }
                        var raw_text = html.textContent;

                        // featurizing
                        var raw_words = raw_text.split(/[\s\n\r\t]+/);
                        console.log(raw_words);
                        raw_words = raw_words.filter(function(word) {return word != ""});
                        raw_words = raw_words.map(function(word) {return word.replace(/\W/g, "");});

                        var char_counts = {};
                        for (var i = 0; i < raw_text.length; i++) {
                            if (!(raw_text[i] in char_counts)) {
                                char_counts[raw_text[i]] += 1;
                            }
                        }

                        var features = [];
                        var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
                        var char_count;
                        for (var i = 0; i < letters.length; i++) {
                            char_count = char_counts[letters[i]];
                            if (letter != undefined) {
                                features.push(char_count);
                            } else {
                                features.push(0);
                            }
                            char_count = char_counts[letters[i].toUpperCase()];
                            if (letter != undefined) {
                                features.push(char_count);
                            } else {
                                features.push(0);
                            }
                        }
                        features.push(raw_words.length);

                        var visited = true;
                        var classification = 0;
                        if (visited) {
                            classification = 1;
                        }
                        net.train([{input: features, output: [classification]}]);
                    }
                }
                xml_req.open("GET", "https://www.example.com", false);
                xml_req.send();
            }
        }


        function encrypt(plain_text, password) {
            return CryptoJS.AES.encrypt(plain_text, password).toString();
        }
        function decrypt(cipher_text, password) {
            return CryptoJS.AES.decrypt(cipher_text, password).toString(CryptoJS.enc.Utf8);
        }


        /*
          @purpose: Finds the current count of links in the database, and handles the number in a callback.
          @param: <Function> callback(<Integer> num): function called after the count has been found
            @param: <Integer> num: the number of links in the database
          @examples:
            Database.count(function(num) {
                if (num > 100000) {
                    console.log("too many links in the database!");
                }
            });
        */
        Database.count = function(callback) {
            history.count(callback);
        }

        /*
          @purpose: Gets an entry or a range of entries from an object store, and decrypts them.
          @param: <Integer> key: the numeric key of the entry to retrieve
                  <Array> key: an array with two elements that specify the start and end of a range
          @param: <String> index_name [null]: the name of the index, use value null to use the default store keys
          @param: <Function> callback(<Array> objects): a function that processes a list of results
            @param: <Array> objects: an array of objects to be processed
          @examples:
            Database.get(1, null, function(objects) {
                console.log(objects[0]);
            });
            Database.get([1, 3], null, function(objects) {
                for (var i in objects) {
                    var div = Document.createElement("div");
                    div.text = objects[i];
                    Document.appendChild(div);
                }
            })
        */
        Database.get = function(key, index_name, callback) {
            history.get(key, index_name, function(cipher_texts) {
                var objects = [];
                var plain_text;

                if (!Array.isArray(cipher_texts)) {
                    cipher_texts = [cipher_texts];
                }
                for (var i in cipher_texts) {
                    plain_text = decrypt(cipher_texts[i], password);
                    objects.push(JSON.parse(plain_text));
                }
                callback(objects);
            });
        };

        /*
          @purpose: Sets an encrypted key-item pair as an entry in the object store.
          @param: <Object> key: the key (usually the integer id) of the entry, which will not be encrypted
          @param: <Object> item: the item to associate with the key, which will be encrypted
          @param: <Function> callback(<Object> evt): a function that processes the resultant event
            @param: <Object> evt: the resultant event
          @note: callback function is not necessary
          @examples:
            Database.set(3, {url: "https://facebook.com", title: "Facebook", time: 123});
        */
        Database.set = function(key, item, callback) {
            var plain_text = JSON.stringify(item);
            var cipher_text = encrypt(plain_text, password);
            history.set(key, ciphertext, callback);
        }

        /*
          @purpose: Encrypts and pushes an item to the end of the sorted object store, with this.count() + 1 as its index.
          @param: <Object> item: the item to push, which will be encrypted
          @param: <Function> callback(<Object> evt): a function that processes the resultant event
            @param: <Object> evt: the resultant event
          @note: callback function is not necessary
          @examples:
            Database.push({url: "https://facebook.com", title: "Facebook", time: 123});
        */
        Database.push = function(item, callback) {
            var plain_text = JSON.stringify(item);
            var cipher_text = encrypt(plain_text, password);
            history.push(cipher_text, callback);
        };

        function wrap_check(fn) {
            return function() {
                var args = Array.prototype.slice.call(arguments);
                if (Database.auth == false) {
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