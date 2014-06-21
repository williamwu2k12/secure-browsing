/**************************
**  Storing and Getting  **
**************************/

/**
* function store(key, value)
* @purpose: stores the string value of JSON object in local storage
* @param: key: string, either date of access, index, or url
* @param: value: JSON dictionary, of type link
* @param: password: the password to encrypt the data with
**/
function store(key, value, password)
{
    // var object = {};
    // object[encrypt(key)] = encrypt(JSON.stringify(value));
    // chrome.storage.local.set(object, function()
    // {
    //     // this should split the keys into more manageable arrays, considering average number of links is 1000 per day, and a month would be 30000
    //     // change from convertDate().substring(2, 6) to convertDate().substring(2, 8) to split into days instead of months
    //     var month = "keys" + convertDate().substring(2, 6);
    //     chrome.storage.local.get(month, function(keys))
    //     {
    //         if (keys[month] == undefined)
    //         {
    //             keys[month] = [];
    //         }
    //         keys[month].push(encrypt(key));
    //         chrome.storage.local.set(keys);
    //     }
    // });
    var dict = {};
    var dictkey = CryptoJS.AES.encrypt(key, password).toString();
    var dictvalue = CryptoJS.AES.encrypt(JSON.stringify(value), password).toString();
    dict[dictkey] = dictvalue;
    chrome.storage.local.set(dict, function()
    {
        chrome.storage.local.get("keys", function(object)
        {
            object["keys"].push(dictkey);
            chrome.storage.local.set(object);
        });
    });
}

/**
* function link(address)
* @purpose: constructor creating the main history object
* @param: address: the url accessed
* @note: needs to be updated with more fields later, structure possibly changed
* @note: what information about the link and the visit is important
* @note: consider keylogging, have it be user turned on or off
* @note: problem with getting document.title using tab.title, gives incorrect title, may need to use message passing
**/
function link(address, labels, incognito)
{
    this.url = address;
    this.tags = labels; // should be list of strings, first item in tags should always be the title string (document.title)
    this.state = incognito;
    // this.bookmarks = [];
    // this.sessions = [];
    // this.searches = [];
    // this.popularity = 0;
    // this.parents = [];
    // this.children = [];
    // this.scroll = 0;
    // this.clicks = [];
    // this.keypresses = []; // careful on logging, security issue here, but can partially remember form info
    // this.accesses = [];
}

/**
* function storeUrl(url)
* @purpose: stores the url, access data, and other information of the visit
* @param: url: the url to be stored
* @note: url should be interchangeable with location.href
* @note: make sure that on window close, links closed simultaneously do not overwrite each other
**/
function storeUrl(url, tags, state)
{
    chrome.storage.local.get("password", function(object)
    {
        if (object["password"] != "")
        {
            var hyperlink = new link(url, tags, state);
            store(convertDate(), hyperlink, object["password"]);
        }
    });
}



/***********************
**  Helper Functions  **
***********************/

/**
* @purpose: gets the first object for which the key matches
**/
Object.prototype.getKeyByValue = function(value)
{
    for (var key in this)
    {
        if (this.hasOwnProperty(key))
        {
            if (this[key] === value)
            {
                return key;
            }
        }
    }
}

/**
* function convertDate()
* @purpose: converts the date format to a string with only integers
* @note: in history.js, the returned value of this is spliced with ":" for better viewing
**/
function convertDate()
{
    var today = new Date();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();
    var millisecond = today.getMilliseconds();
    if (month < 10)
    {
        month = "0" + month;
    }
    if (day < 10)
    {
        day = "0" + day;
    }
    if (hour < 10)
    {
        hour = "0" + hour;
    }
    if (minute < 10)
    {
        minute = "0" + minute;
    }
    if (second < 10)
    {
        second = "0" + second;
    }
    if (millisecond < 100)
    {
        if (millisecond < 10)
        {
            millisecond = "0" + millisecond;
        }
        millisecond = "0" + millisecond;
    }
    return "" + today.getFullYear() + month + day + hour + minute + second + millisecond;
    // today.getFullYear().toString().substring(2, 4);
}



/****************
**  Debugging  **
****************/

/**
* function clearStorage()
* @purpose: deletes all items in storage area
**/
function clearStorage()
{
    chrome.storage.local.clear();
}

/**
* function printStorage()
* @purpose: prints the current state of the storage, decrypted
**/
function printStorage()
{
    chrome.storage.local.get(null, function(objects)
    {
        // var allkeys = Object.keys(objects);
        // var allobjects = objects;
        // // console.log(allobjects);
        // for (var key in allobjects)
        // {
        //     if (allobjects.hasOwnProperty(key))
        //     {
        //         console.log(decrypt(key) + ": " + decrypt(allobjects[key]));
        //     }
        // }

        // var keys = Object.keys(objects);
        // keys.splice(keys.indexOf("keys"), 1);
        // for (var i = 0; i < keys.length; i++)
        // {
        //     console.log(decrypt(keys[i]) + " : " + decrypt(objects[keys[i]]));
        // }
        // console.log(objects["keys"]);
        var keys = objects["keys"];
        var object;
        for (var i = 0; i < keys.length; i++)
        {
            object = CryptoJS.AES.decrypt(objects[keys[i]], objects["password"]);
            console.log(object.toString(CryptoJS.enc.Utf8));
        }
    });
};