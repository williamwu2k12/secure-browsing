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
function store(key, value, username, password)
{
    // this should split the keys into more manageable arrays, considering average number of links is 1000 per day, and a month would be 30000
    var date = "keys" + key.substring(0, 6) + username;
    var userkeys = "keys" + username;

    key = CryptoJS.AES.encrypt(key, password).toString();
    value = CryptoJS.AES.encrypt(JSON.stringify(value), password).toString();

    var dict = {};
    dict[key] = value;
    
    chrome.storage.local.set(dict, function()
    {
        chrome.storage.local.get(date, function(object)
        {
            if (object[date] == undefined)
            {
                object[date] = [];
                chrome.storage.local.get(userkeys, function(obj)
                {
                    obj[userkeys].push(date);
                    chrome.storage.local.set(obj);
                });
            }
            object[date].push(key);
            chrome.storage.local.set(object);
        });
    });
}

/**
* function link(address)
* @purpose: constructor creating the main history object
* @param: name: the title of the page, should be document.title but currently tab.title
* @param: address: the url accessed
* @param: labels: user defined labels for the link
* @param: incognito: a boolean indicating whether link was accessed in incognito
* @note: needs to be updated with more fields later, structure possibly changed
* @note: what information about the link and the visit is important
* @note: consider keylogging, have it be user turned on or off
* @note: problem with getting document.title using tab.title, gives incorrect title, may need to use message passing
**/
function link(name, address, labels, incognito)
{
    this.title = name;
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
* @purpose: checks conditions of environment before storing the url, access data, and other information of the visit
* @param: url: the url to be stored
* @note: url should be interchangeable with location.href
* @note: make sure that on window close, links closed simultaneously do not overwrite each other
**/
function storeUrl(title, url, tags, state)
{
    chrome.storage.local.get("password", function(object)
    {
        chrome.storage.local.get("username", function(thing)
        {
            if (object["password"] != "")
            {
                var hyperlink = new link(title, url, tags, state);
                store(convertDate(), hyperlink, thing["username"], object["password"]);
            }
        });
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
    return "" + today.getFullYear().toString().substring(2, 4) + month + day + hour + minute + second + millisecond;
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
* function readStorage();
* @purpose: prints everything in storage
**/
function readStorage()
{
    chrome.storage.local.get(null, function(objects)
    {
        console.log(objects);
    });
}

/**
* function printStorage()
* @purpose: prints the current state of the storage, decrypted
**/
function printStorage()
{
    chrome.storage.local.get(null, function(objects)
    {
        var userkeys = "keys" + objects["username"]
        var listkeys = objects[userkeys];
        var password = objects["password"];
        var keys;
        var key;
        var object;
        for (var j = listkeys.length - 1; j > -1; j--)
        {
            keys = objects[objects[userkeys][j]];
            for (var i = 0; i < keys.length; i++)
            {
                key = CryptoJS.AES.decrypt(keys[i], password);
                object = CryptoJS.AES.decrypt(objects[keys[i]], password);
                console.log(key.toString(CryptoJS.enc.Utf8) + ":" + object.toString(CryptoJS.enc.Utf8));
            }
        }
    });
}