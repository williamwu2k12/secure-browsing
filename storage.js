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
**/
function link(address)
{
    this.url = address;
    this.accesses = [];
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
* @note: checks to make sure that the url is not empty
**/
function storeUrl(url)
{
    StorageArea.get(encrypt(url), function(object)
    {
        var hyperlink = object[encrypt(url)];
        var today = new Date();
        if (hyperlink == undefined)
        {
            hyperlink = new link(url);
        }
        else
        {
            hyperlink = JSON.parse(decrypt(hyperlink));
        }
        hyperlink.accesses.push({year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate(), hour: today.getHours(), minute: today.getMinutes(), second: today.getSeconds(), milliseconds: today.getMilliseconds()});
        store(url, hyperlink);
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



/****************************
**  Miscellaneous Helpers  **
****************************/

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