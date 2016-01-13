define([],

function() {

    var Datastore = function(name) {

        var self = this;

        function init_class() {
            Datastore.DB_NAME       = "secure_browsing";
            Datastore.DB_VERSION    = undefined;

            Datastore.READ_WRITE    = "readwrite"; // 1 in chrome
            Datastore.READ_ONLY     = "readonly"; // 0 in chrome

            Datastore.indexedDB     = window.indexedDB ||
                                      window.webkitIndexedDB ||
                                      window.mozIndexedDB ||
                                      window.msIndexedDB ||
                                      window.shimIndexedDB;

            Datastore.db            = undefined;
            Datastore.promise       = undefined;

            Datastore.open          = promise_init;
            Datastore.close         = function() {db.close();};
        }

        if (Datastore.DB_NAME == undefined) {
            init_class();
        }




        function init(resolve, schema, db_version) {
            var open_req;
            var db_updated = db_version != undefined ? true : false;
            if (db_version == undefined) {
                open_req = Datastore.indexedDB.open(Datastore.DB_NAME);
            } else {
                open_req = Datastore.indexedDB.open(Datastore.DB_NAME, db_version);
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

                    Datastore.db = open_req.result;

                    if (!Datastore.db.objectStoreNames.contains(store_name)) {
                        var store = Datastore.db.createObjectStore(store_name, {autoIncrement: increment});
                        var index;
                        store.createIndex("index", "", {unique: false});
                        for (var i in indexes) {
                            index = indexes[i];
                            store.createIndex(index + "_index", index, {unique: false});
                        }
                    }

                }
            };

            open_req.onsuccess = function(evt) {
                Datastore.db = open_req.result;
                if (db_updated == true) {
                    resolve();
                } else {
                    Datastore.DB_VERSION = Datastore.db.version + 1;
                    Datastore.db.close();
                    init(resolve, schema, Datastore.DB_VERSION);
                }
            };
        }

        function promise_init(schema, callback) {
            Datastore.promise = new Promise(function(resolve, reject) {
                init(resolve, schema);
            });
            Datastore.promise = Datastore.promise.then(function() {
                if (callback != undefined) {
                    callback();
                }
            });
        }


        if (name != undefined) {
            self.store_name = name;

            function access_store(store_name, permissions) {
                store_name = store_name != undefined && store_name != null ? store_name : self.store_name;
                permissions = permissions != undefined && permissions != null ? permissions : Datastore.READ_WRITE;

                var transaction = Datastore.db.transaction([store_name], permissions);
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
                if (index_name != null && index_name != undefined) {
                    index = store.index(index_name)
                }

                if ((Number.isInteger(key) && key >= 0) || typeof(key) == "string") {
                    if (index_name == "index") {
                        req = index.getKey(key);
                    } else {
                        req = index.get(key);
                    }
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
                    if (Datastore.promise == undefined) {
                        promise_init(schema);
                    }
                    Datastore.promise = Datastore.promise.then(function() {
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

        } else {

            return Datastore;

        }
    }

    return Datastore;

});