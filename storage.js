/**************************
**  Storing and Getting  **
**************************/

/**
* function store(key, value)
* @purpose: stores the string value of JSON object in local storage
* @param: key: string, either date of access, index, or url
* @param: value: JSON dictionary, of type link
**/
function store(key, value)
{
    var object = {};
    object[encrypt(key)] = encrypt(JSON.stringify(value));
    StorageArea.set(object);
}

/**
* function get(key)
* @purpose: retrieves the object, decrypts, reconverts to JSON, logs to console
* @param: key: string, either date of access, index, or url
**/
function get(key)
{
    StorageArea.get(key, function(object)
    {
        console.log(decrypt(object[decrypt(key)]));
    });
}

/**
* function link(address)
* @purpose: constructor creating the main history object
* @param: address: the url accessed
* @note: needs to be updated with more fields later, structure possibly changed
* @note: what information about the link and the visit is important
* @note: consider keylogging, have it be user turned on or off
**/
function link(address, labels)
{
    this.url = address;
    this.tags = labels; // should be list of strings, first item in tags should always be the title string
    // this.bookmarks = [];
    // this.tags = [];
    // this.session = [];
    // this.searches = [];
}

/**
* function storeUrl(url)
* @purpose: stores the url, access data, and other information of the visit
* @param: url: the url to be stored
* @note: url should be interchangeable with location.href
* @note: make sure that on window close, links closed simultaneously do not overwrite each other
**/
function storeUrl(url)
{
    StorageArea.get(encrypt(url), function(object)
    {
        var hyperlink = new link(url, null);
        store(convertDate(), hyperlink);
        // console.log("Storing " + JSON.stringify(hyperlink) + " succeeded.");
    })
}

/**
* function encrypt(value)
* @purpose: encrypts the JSON string so that people with access to file can't use it
* @param: value: string to be encrypted
**/
function encrypt(value)
{
    var secret = "";
    for (var letter = 0; letter < value.length; letter++)
    {
        secret += cipher[value.charAt(letter)];
    }
    return secret;
}

/**
* function decrypt(value)
* @purpose: decrypts a JSON string so that the right users can access it
* @param: value: string to be decrypted
**/
function decrypt(value)
{
    var unsecret = "";
    for (var letter = 0; letter < value.length; letter++)
    {
        unsecret += cipher.getKeyByValue(value.charAt(letter));
    }
    return unsecret;
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
        var allkeys = Object.keys(objects);
        var allobjects = objects;
        // console.log(allobjects);
        for (var key in allobjects)
        {
            if (allobjects.hasOwnProperty(key))
            {
                console.log(decrypt(key) + ": " + decrypt(allobjects[key]));
            }
        }
    });
};