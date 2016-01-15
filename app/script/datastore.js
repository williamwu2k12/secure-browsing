define([],

function() {

    /*
      @note: to initialize:
      > Datastore().open(schema);
    */
    function Datastore(name) {

        var self = this;

        function init_class() {
            Datastore.DB_NAME       = "secure_browsing";
            Datastore.DB_VERSION    = undefined;

            Datastore.READ_WRITE    = "readwrite"; // 1 in chrome
            Datastore.READ_ONLY     = "readonly"; // 0 in chrome
            Datastore.CREATE        = "create";
            Datastore.DELETE        = "delete";

            Datastore.indexedDB     = window.indexedDB ||
                                      window.webkitIndexedDB ||
                                      window.mozIndexedDB ||
                                      window.msIndexedDB ||
                                      window.shimIndexedDB;

            Datastore.idb           = undefined;
            Datastore.promise       = undefined;



            function init(resolve, operation, schema, db_version) {
                var open_req;
                var db_updated = db_version != undefined ? true : false;
                if (db_version == undefined) {
                    open_req = Datastore.indexedDB.open(Datastore.DB_NAME);
                } else {
                    open_req = Datastore.indexedDB.open(Datastore.DB_NAME, db_version);
                }

                // will be run on every startup, setup schema if necessary
                open_req.onupgradeneeded = function(evt) {
                    Datastore.idb = open_req.result;
                    var stores = schema.stores;
                    var store;
                    for (var i in stores) {
                        store = stores[i];
                        if (operation == Datastore.CREATE) {
                            if (!Datastore.idb.objectStoreNames.contains(store.name)) {
                                init_store(store.name, store.increment, store.indexes)
                            }
                        } else if (operation == Datastore.DELETE) {
                            if (Datastore.idb.objectStoreNames.contains(store.name)) {
                                Datastore.idb.deleteObjectStore(store.name);
                            }
                        }

                    }
                };

                open_req.onsuccess = function(evt) {
                    Datastore.idb = open_req.result;
                    if (db_updated == true) {
                        resolve();
                    } else {
                        Datastore.DB_VERSION = Datastore.idb.version + 1;
                        Datastore.idb.close();
                        init(resolve, Datastore.CREATE, schema, Datastore.DB_VERSION);
                    }
                };
            }

            function init_store(store_name, increment, indexes) {
                var store = Datastore.idb.createObjectStore(store_name, {autoIncrement: increment});
                store.createIndex("index", "", {unique: false});
                for (var i in indexes) {
                    store.createIndex(indexes[i] + "_index", indexes[i], {unique: false});
                }
            }

            /*
            @purpose: inits a promise object that all other api calls will chain on, which guarantees that the datastore has been setup
            @param: <String> operation [Datastore.CREATE, Datastore.DELETE]: the operation to apply to the schema; if CREATE, then all object stores in the schema will be added to the datastore, if DELETE, then they will be deleted
            @param: <Function> callback(): a function that executes immediately after the datastore has been initialized
            */
            function init_promise(operation, schema, callback) {
                Datastore.promise = new Promise(function(resolve, reject) {
                    init(resolve, operation, schema);
                });
                Datastore.promise = Datastore.promise.then(function() {
                    if (callback != undefined) {
                        callback();
                    }
                });
            }

            Datastore.open          = function(schema, callback) {
                callback = callback != undefined ? callback : function(){};
                init_promise(Datastore.CREATE, schema, callback);
            };
            Datastore.close         = function(callback) {
                callback = callback != undefined ? callback : function(){};
                Datastore.idb.close(); callback();
            };
            Datastore.create_store  = function(schema, callback) {
                callback = callback != undefined ? callback : function(){};
                if (Datastore.idb != undefined) {
                    Datastore.close();
                }
                init_promise(Datastore.CREATE, schema, callback);
            };
            Datastore.delete_store  = function(schema, callback) {
                callback = callback != undefined ? callback : function(){};
                if (Datastore.idb != undefined) {
                    Datastore.close();
                }
                init_promise(Datastore.DELETE, schema, callback);
            };
        }

        if (Datastore.DB_NAME == undefined) {
            init_class();
        }





        // check whether this is suppose to be an instance
        if (name != undefined) {
            self.store_name = name;

            function access_store(store_name, permissions) {
                store_name = store_name != undefined && store_name != null ? store_name : self.store_name;
                permissions = permissions != undefined && permissions != null ? permissions : Datastore.READ_WRITE;

                var transaction = Datastore.idb.transaction([store_name], permissions);
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
                      <Array> key: an array with two elements that specify the start and end of a range
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
              @purpose: Removes the current last entry in the object store by setting its value to an empty string.
              @param: <Function> callback(<Object> evt): a function that processes the resultant event
              @note: will not decrement the count
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


        
            function check_init(fn) {
                return function() {
                    var args = Array.prototype.slice.call(arguments);
                    if (Datastore.promise == undefined) {
                        Datastore.open(schema);
                    }
                    Datastore.promise = Datastore.promise.then(function() {
                        return new Promise(function(resolve, reject) {
                            var callback;
                            if (args.length > 0) {
                                callback = args[args.length - 1];
                            }
                            if (typeof(callback) != "function") {
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

    Datastore();

    return Datastore;

});