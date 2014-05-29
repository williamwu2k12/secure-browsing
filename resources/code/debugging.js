/**
* IMPORTANT
* COPY PASTE ALL IN THIS DOCUMENT TO THE CONSOLE IN "BACKGROUND PAGE"
* CONSTANTLY UPDATE AS STORAGE.JS AND CONTENT.JS CHANGE
**/

// var StorageArea = chrome.storage.local;
// var cipher = { '0': 't', '1': 'S', '2': ' ', '3': 'm', '4': '9', '5': 'L', '6': 'h', '7': 'q', '8': 'B', '9': '4', u: 'd', d: 'u', '<': 'W', W: '<', m: '3', '$': '(', '(': '$', ' ': '2', B: '8', Q: '#', '#': 'Q', '[': ',', ',': '[', N: '\'', '\'': 'N', v: 'O', O: 'v', s: '?', '?': 's', ')': '`', '`': ')', '>': '}', '}': '>', q: '7', E: 'Z', Z: 'E', H: 'V', V: 'H', '.': '|', '|': '.', S: '1', D: 'y', y: 'D', n: '^', '^': 'n', '&': ':', ':': '&', J: '_', _: 'J', K: 'b', b: 'K', c: 'g', g: 'c', X: 'f', f: 'X', T: '-', '-': 'T', h: '6', r: '/', '/': 'r', '*': 'k', k: '*', M: '%', '%': 'M', I: 'i', i: 'I', '+': 'p', p: '+', R: ';', ';': 'R', j: 'l', l: 'j', U: 'w', w: 'U', '~': 'z', z: '~', t: '0', L: '5', ']': '=', '=': ']', '{': 'F', F: '{', e: 'P', P: 'e', '"': 'a', a: '"', o: 'x', x: 'o', '@': 'Y', Y: '@', '\\': 'G', G: '\\', C: '', '': 'C', '!': 'A', A: '!' };

// Object.prototype.getKeyByValue = function(value)
// {
//     for (var key in this)
//     {
//         if (this.hasOwnProperty(key))
//         {
//             if (this[key] === value)
//             {
//                 return key;
//             }
//         }
//     }
// }

// function store(key, value)
// {
//     var object = {};
//     object[encrypt(key)] = encrypt(JSON.stringify(value));
//     StorageArea.set(object);
// }

// function get(key)
// {
//     StorageArea.get(key, function(object)
//     {
//         console.log(decrypt(object[decrypt(key)]));
//     });
// }

// function link(address)
// {
//     this.url = address;
//     this.accesses = [];
//     // this.bookmarks = [];
//     // this.tags = [];
//     // this.session = [];
//     // this.searches = [];
// }

// function storeUrl(url)
// {
//     StorageArea.get(encrypt(url), function(object)
//     {
//         var hyperlink = object[encrypt(url)];
//         var today = new Date();
//         if (hyperlink == undefined)
//         {
//             hyperlink = new link(url);
//         }
//         else
//         {
//             hyperlink = JSON.parse(decrypt(hyperlink));
//         }
//         hyperlink.accesses.push({year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate(), hour: today.getHours(), minute: today.getMinutes(), second: today.getSeconds(), milliseconds: today.getMilliseconds()});
//         store(url, hyperlink);
//         // console.log("Storing " + JSON.stringify(hyperlink) + " succeeded.");
//     })
// }

// function encrypt(value)
// {
//     var secret = "";
//     for (var letter = 0; letter < value.length; letter++)
//     {
//         secret += cipher[value.charAt(letter)];
//     }
//     return secret;
// }

// function decrypt(value)
// {
//     var unsecret = "";
//     for (var letter = 0; letter < value.length; letter++)
//     {
//         unsecret += cipher.getKeyByValue(value.charAt(letter));
//     }
//     return unsecret;
// }



// /*********************
// **  Main Functions  **
// *********************/

// function clearStorage()
// {
//     chrome.storage.local.clear();
// }

// function printStorage()
// {
//     chrome.storage.local.get(null, function(objects)
//     {
//         var allkeys = Object.keys(objects);
//         var allobjects = objects;
//         // console.log(allobjects);
//         for (var key in allobjects)
//         {
//             if (allobjects.hasOwnProperty(key))
//             {
//                 console.log(decrypt(key) + ": " + decrypt(allobjects[key]));
//             }
//         }
//     });
// };


// /***********
// **  Main  **
// ***********/

// printStorage();

// EVERYTHING DEPRECATED BECAUSE DEBUGGING CAN NOW BE DONE IN THE BACKGROUND CONSOLE, SINCE STORAGE IS LOADED