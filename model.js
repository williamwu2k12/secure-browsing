/* the model file handles object storage */

p = function(string){console.log(string);};

var cryptojs_path = "./resources/libraries/cryptojs";
require([cryptojs_path + "/rollups/aes.js",
         cryptojs_path + "/rollups/sha256.js"],
        function() {
            main();
        });


function main() {



    db = new database("will", "penises");
    

    function database(username, password) {
        var schema = 
        {
            stores: 
            [
                {
                    name: "__metadata__",
                    increment: false,
                    indexes: []
                }
            ]
        }
        schema.stores.push(
        {
            name: username,
            increment: true,
            indexes: ["time"]
        });


        datastore().open(schema);
        var metadata    = new datastore("__metadata__");
        var links       = new datastore(username);


        metadata.get(username, null, function(value) {
            var hash_text = CryptoJS.SHA256(password).toString();
            if (value == undefined) {
                metadata.set(username, hash_text, function(){});
            } else if (value != hash_text) {
                throw new Error("Password is incorrect!"); // fix this
            }
        });

        this.get = function(key, index_name, callback) {
            links.get(key, index_name, function(value) {
                var plain_text = CryptoJS.AES.decrypt(value, password).toString(CryptoJS.enc.Utf8);
                callback(plain_text);
            });
        };

        this.push = function(item, callback) {
            var plain_text = JSON.stringify(item);
            var cipher_text = CryptoJS.AES.encrypt(plain_text, password).toString();
            links.push(cipher_text, callback);
        };
    }



    function datastore(name) {

        var self = this;

        datastore.DB_NAME       = "secure_browsing";
        datastore.DB_VERSION    = undefined;

        datastore.READ_WRITE    = "readwrite"; // 1 in chrome
        datastore.READ_ONLY     = "readonly"; // 0 in chrome

        datastore.indexedDB     = window.indexedDB ||
                                  window.webkitIndexedDB ||
                                  window.mozIndexedDB ||
                                  window.msIndexedDB ||
                                  window.shimIndexedDB;
        datastore.db;
        datastore.promise;
        datastore.open;
        datastore.close;

        this.store_name         = name;

        function init(resolve, schema, db_version) {
            var open_req;
            var db_updated = db_version != undefined ? true : false;
            if (db_version == undefined) {
                open_req = datastore.indexedDB.open(datastore.DB_NAME);
            } else {
                open_req = datastore.indexedDB.open(datastore.DB_NAME, db_version);
            }

            // will be run on every startup, setup schema if necessary
            open_req.onupgradeneeded = function(evt) {
                var stores = schema.stores;
                var store;
                var store_name;
                var increment;
                var indexes;
                for (var x in stores) {

                    store = stores[x];
                    store_name = store.name;
                    increment = store.increment;
                    indexes = store.indexes;

                    datastore.db = open_req.result;

                    if (!datastore.db.objectStoreNames.contains(store_name)) {
                        var store = datastore.db.createObjectStore(store_name, {autoIncrement: increment});
                        var index;
                        for (var i in indexes) {
                            index = indexes[i];
                            store.createIndex(index + "_index", index, {unique: false});
                        }
                    }

                }
            };

            open_req.onsuccess = function(evt) {
                datastore.db = open_req.result;
                if (db_updated == true) {
                    resolve();
                } else {
                    datastore.DB_VERSION = datastore.db.version + 1;
                    datastore.db.close();
                    init(resolve, schema, datastore.DB_VERSION);
                }
            };
        }

        function promise_init(schema) {
            datastore.promise = new Promise(function(resolve, reject) {
                init(resolve, schema);
            });
        }

        datastore.open = promise_init;
        datastore.close = function(){db.close();};


        var access_store = function(store_name, permissions) {
            store_name = store_name != undefined && store_name != null ? store_name : self.store_name;
            permissions = permissions != undefined && permissions != null ? permissions : datastore.READ_WRITE;

            var transaction = datastore.db.transaction([store_name], permissions);
            var store = transaction.objectStore(store_name);
            return store;
        }

        /*
          @purpose: Gets the current total number of entries in this object store.
          @param: <Function> callback(<Integer> num): a function that takes in the resultant count integer
          @examples:
            db.count(function(num) {
                console.log(num);
            });
        */
        this.count  = function(callback) {
            var store = access_store();
            var req = store.count();
            req.onsuccess = function(evt) {
                callback(evt.target.result);
            }
        }

        /*
          @purpose: Gets an entry or a range of entries from an object store.
          @param: <Integer> key: the numeric key of the entry to retrieve
          @param: <Array> key: an array with two elements that specify the start and end of a range
          @param: <String> index_name [null]: the name of the index, use value null to use the default store keys
          @param: <Function> callback(<Object> obj): a function that takes in the resultant object, or an array of resultant objects, dependant on whether the key is an integer or an array
          @examples:
            db.get(1, null, function(value) {console.log(value);});
            db.get([1, 3], "time_index", function(values) {
                for (var i in values) {
                    console.log(values[i]);
                } 
            });
        */
        this.get    = function(key, index_name, callback) {
            var store = access_store();
            var req;

            var index = store;
            if (index_name != null) {
                index = store.index(index_name)
            }

            if ((Number.isInteger(key) && key >= 0) || typeof(key) == "string") {
                req = index.get(key);
                req.onsuccess = function(evt) {
                    callback(evt.target.result);
                }
            } else if (Array.isArray(key) && key.length == 2) {
                var start = key[0];
                var end = key[1] - 1;
                req = index.openCursor(IDBKeyRange.bound(start, end));

                var values = [];
                var promise = new Promise(function(resolve, reject) {
                    req.onsuccess = function(evt) {
                        var cursor = evt.target.result;
                        if (cursor) {
                            values.push(cursor.value);
                            cursor.continue();
                        } else {
                            resolve();
                        }
                    };
                }).then(function(){callback(values);});
            } else {

            }
        }
        
        /*
          @purpose: Sets a key-item pair as an entry in the object store.
          @param: <Object> key: the key (usually the integer id) of the entry
          @param: <Object> item: the item to associate with the key
          @param: <Function> callback(<Object> evt): a function that processes the resultant event
        */
        this.set    = function(key, item, callback) {
            var store = access_store();
            var req = store.put(item, key);
            req.onsuccess = function(evt) {
                callback(evt);
            };
        }
        
        /*
          @purpose: Pushes an item to the end of the sorted object store, with this.count() + 1 as its index.
          @param: <Object> item: the item to associate with the key
          @param: <Function> callback(<Object> evt): a function that processes the resultant event
        */
        this.push   = function(item, callback) {
            var store = access_store();
            var req = store.add(item);
            req.onsuccess = function(evt) {
                callback(evt)
            };
        }
        
        /*
          @purpose: Removes the last entry in the object store by setting its value to an empty string.
          @param: <Function> callback(<Object> evt): a function that processes the resultant event
        */
        this.pop    = function(callback) {
            self.count(function(num) {
                self.remove(num, callback);
            });
        }
        
        /*
          @purpose: Removes an entry from the object store with corresponding key by setting the entry's value to an empty string.
          @param: <Object> key: the key (usually the integer id) of the entry
          @param: <Function> callback(<Object> evt): a function that processes the resultant event
        */
        this.remove = function(key, callback) {
            self.set(key, "", callback);
        }

        /*
          @purpose: Clears all entries in the object store, without resetting the current autoIncrement index.
          @param: <Function> callback(<Object> evt): a function that processes the resultant event
        */
        this.clear  = function(callback) {
            var store = access_store();
            var req = store.clear();
            req.onsuccess = function(evt) {
                console.log("success: cleared the store for user");
                callback(evt);
            }
            req.onerror = function(evt) {
                console.log("failure: could not clear user store");
                console.log(evt);
            }
        }


        var check_init = function(fn) {
            return function() {
                var args = Array.prototype.slice.call(arguments);
                if (datastore.promise == undefined) {
                    promise_init(schema);
                }
                datastore.promise = datastore.promise.then(function() {
                    return new Promise(function(resolve, reject) {
                        var callback;
                        if (args.length > 0) {
                            callback = args[args.length - 1];
                        }
                        if (typeof(callback) != "function") {
                            // args.push(function(evt){console.log(evt.target.result);});
                            args.push(function(){});
                        }
                        fn.apply(self, args);
                        resolve();
                    });
                });
            };
        };
        this.count  = check_init(this.count);
        this.get    = check_init(this.get);
        this.set    = check_init(this.set);
        this.push   = check_init(this.push);
        this.pop    = check_init(this.pop);
        this.remove = check_init(this.remove);
        this.clear  = check_init(this.clear);

        this.seed = function(k) {
            var link;
            var store;
            for (var i = 0; i < k; i++) {
                store = access_store();
                link = {url: String(i), time: Math.floor(Math.random() * 1000000000), title: String(i)};
                req = store.add(link);
            }
        }

        this.test = function() {

            // this.push({url: "qwer", time: 100, title: ":("});
            // this.get([1, 2], null, function(results){console.log(results)});
        }
        this.test = check_init(this.test);
        // this.test();

        if (name == undefined) {
            return datastore;
        }
    }
}









// /*
//     {
//         key_id_map: {
//             william: 0
//             shiv: 1
//         },
//         pass_hashes: {
//             00: 
//             01: 4ffdare3513k7trbh
//         }
//         00_count: 2,
//         01_count: 1,
//         00_0000000000: {
//             url: "https://github.com",
//             date: 1451864636696
//         },
//         00_0000000001: {
//             url: "https://github.com/williamwu2k12/secure-browsing",
//             date: 1451864644091
//         },
//         01_0000000000: {
//             url: "https://facebook.com",
//             date: 1451864632013
//         }
//     }
// */



// function database()
// {
//     var username = "william";
//     this.password = "";
//     this.array = new kvdb_array(username);

//     this.set = function(link, callback)
//     {

//     };

//     this.get = function(callback)
//     {

//     };

//     this.push = function(link, callback)
//     {
//         var plaintext = JSON.stringify(link);
//         var ciphertext = CryptoJS.AES.encrypt(plaintext, password);
//         this.array.push(ciphertext, callback);
//     };

//     this.pop = function(callback)
//     {

//     };
// }

// /*
//  dictionary object where a key may have multiple
//  values and the values are ordered
// */
// function kvdb_array(key)
// {
//     var storage = chrome.storage.local;

//     function pad(str, len, chr)
//     {
//         if (str.length > len) {
//             throw new Error("Length of string is greater than pad length");
//         }
//         return Array(len - str.length + 1).join(chr) + str;
//     }

//     function pad_uuid(uuid)
//     {
//         var len = String(kvdb_array.MAX_ID - 1).length
//         return pad(str=String(uuid),
//                         len=len,
//                         chr="0");
//     }

//     function pad_index(index)
//     {
//         var len = String(kvdb_array.MAX_COUNT - 1).length;
//         return pad(str=String(index),
//                         len=len,
//                         chr="0");
//     }






//     kvdb_array.MAX_ID       = 100;
//     kvdb_array.MAX_COUNT    = 10000000000;
//     kvdb_array.VERSION      = 1.0;

//     if (kvdb_array.instances == undefined) {
//         kvdb_array.instances = {};
//     }
//     if (kvdb_array.key_map_promise == undefined) {
//         kvdb_array.key_map_promise = new Promise(function(resolve, reject)
//         {
//             chrome.storage.local.set({"key_map": {}}, resolve);
//         });
//     }

//     /* 
//       holds all the variables as a singleton
//       object for all javascript kvdb_arrays using 
//       the same key
//     */
//     var vars =
//     {
//         uuid: undefined,
//         count: undefined,

//         uuid_str: undefined,
//         count_str: undefined,

//         promise: undefined
//     }

//     var instance = kvdb_array.instances[key]; // tried to use vars.uuid, but there's issues because of async
//     if (instance != undefined) {
//         vars = instance;
//     } else {
//         init();
//         kvdb_array.instances[key] = vars;
//     }

//     var self = this;














//     function init()
//     {
//         vars.promise = new Promise(function(resolve, reject)
//         {
//             init_extension(function()
//             {
//                 init_uuid(function()
//                 {
//                     init_vars(function()
//                     {
//                         resolve();
//                     });
//                 });
//             });
//         });
//     };

//     function init_extension(callback)
//     {
//         obj = {}
//         obj["sb_version"] = kvdb_array.VERSION;
//         storage.set(obj, callback);
//     }


//     function init_uuid(callback)
//     {
//         kvdb_array.key_map_promise = kvdb_array.key_map_promise.then(function()
//         {
//             return new Promise(function(resolve, reject)
//             {
//                 var req = "key_map";
//                 storage.get(req, function(obj)
//                 {
//                     var uuids = obj[req];

//                     if (!(key in uuids)) {
//                         // create a new mapping from key to uuid
//                         var start = new Date();
//                         var now;

//                         do {
//                             vars.uuid = Math.floor(Math.random() * kvdb_array.MAX_ID);
//                             now = new Date();
//                             if (now.getTime() - start.getTime() > 1000) {
//                                 throw new Error("Too many uuids, not enough space");
//                             }
//                         } while (vars.uuid in uuids);

//                         uuids[key] = vars.uuid;
//                         storage.set(obj, resolve);
//                     }

//                     vars.uuid = uuids[key];
//                     vars.uuid_str = pad_uuid(vars.uuid);

//                     callback();
//                 });
//             });
//         });
//     }

//     function init_vars(callback)
//     {
//         var count_req = vars.uuid_str + "_" + "count";
//         storage.get(count_req, function(obj)
//         {
//             vars.count = obj[count_req];
//             if (vars.count == undefined) {
//                 vars.count = 0;
//                 obj[count_req] = 0;
//                 storage.set(obj, callback);
//             } else {
//                 callback();
//             }
//         });
//     }







//     this.get = function(index, callback)
//     {
//         if (index >= vars.count) {
//             throw new Error("Array index out of bounds");
//         }

//         var index_str = pad_index(index);
//         req = vars.uuid_str + "_" + index_str;
//         storage.get(req, function(obj)
//         {
//             callback(obj[req]);
//         });
//     };

//     this.set = function(item, index, callback)
//     {
//         if (index >= vars.count) {
//             throw new Error("Array index out of bounds");
//         }

//         var dict = {};
//         var index_str = pad_index(index);
//         var k = vars.uuid_str + "_" + index_str;
//         dict[k] = item;

//         storage.set(dict, callback);
//     };

//     this.pop = function(callback)
//     {
//         self.set("", vars.count - 1, function()
//         {
//             vars.count -= 1;

//             var dict = {};
//             dict[vars.uuid_str + "_" + "count"] = vars.count;
//             storage.set(dict, callback);
//         });
//     };

//     this.push = function(item, callback)
//     {
//         var index_str = pad_index(vars.count);
//         var k = vars.uuid_str + "_" + index_str;

//         vars.count += 1;
//         var dict = {};
//         dict[k] = item;
//         dict[vars.uuid_str + "_" + "count"] = vars.count;

//         storage.set(dict, callback);
//     };

//     this.remove = function(index, callback)
//     {
//         self.set("", index, callback);
//     }


//     function check_init(fn)
//     {
//         return function()
//         {
//             var args = arguments;
//             if (vars.promise == undefined) {
//                 init();
//             }
//             vars.promise = vars.promise.then(function()
//             {
//                 return new Promise(function(resolve, reject)
//                 {
//                     var callback = args[args.length - 1];
//                     if (typeof(callback) == "function") {
//                         args[args.length - 1] = function(){
//                             callback();
//                             resolve();
//                         }
//                     } else {
//                         resolve();
//                     }
//                     fn.apply(self, args);
//                 });
//             });
//             // vars.promise = vars.promise.then(function()
//             // {
//             //     fn.apply(self, args);
//             // });
//         }
//     }
//     // fix here, get shouldn't have to wait since it doesn't modify anything
//     this.get = check_init(this.get);
//     this.set = check_init(this.set);
//     this.push = check_init(this.push);
//     this.pop = check_init(this.pop);
//     this.remove = check_init(this.remove);

// }

// // db = new database();






















// /*
// testing and debugging
// */

// storage = chrome.storage.local;

// function test_push()
// {
//     drop_storage(function()
//     {
//         arr0 = new kvdb_array("will");
//         arr1 = new kvdb_array("shiv");
        
//         arr0.push("1");
//         arr0.push("2");
//         arr0.push("3");
//         arr1.push("a");
//         arr1.push("b", show_storage);
//     });
// }

// function test_pop()
// {
//     drop_storage(function()
//     {
//         arr0 = new kvdb_array("will");
//         arr0.push("1");
//         arr0.push("2");
//         arr0.pop();
//         arr0.push("3");
//         arr0.push("4");
//         arr0.pop(show_storage);
//     });
// }

// function test_set()
// {
//     drop_storage(function()
//     {
//         arr0 = new kvdb_array("will");
//         arr0.push("1");
//         arr0.push("2");
//         arr0.push("3");
//         arr0.set("69", 0);
//         arr0.set("96", 2, show_storage);
//     });
// }

// function test_get()
// {
//     drop_storage(function()
//     {
//         arr0 = new kvdb_array("will");
//         arr0.push("1");
//         arr0.push("2");
//         arr0.push("3");
//         arr0.get(0, function(item){console.log(item);});
//         arr0.get(1, function(item){console.log(item);});
//         arr0.get(2, function(item){console.log(item);});
//         // arr0.get(3, function(item){console.log(item);});
//         // arr0.get(-1, function(item){console.log(item);});
//     });
// }


// function drop_storage(callback)
// {
//     chrome.storage.local.clear(callback);
// }

// function show_storage()
// {
//     chrome.storage.local.get(null, function(obj)
//     {
//         console.log(JSON.stringify(obj, null, 4));
//     });
// }