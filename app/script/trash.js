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