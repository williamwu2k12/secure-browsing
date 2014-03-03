// var setting for api accessing and substitution cipher
var StorageArea = chrome.storage.local;
var cipher = setupCipher();



// store and get functions
function store(key, value)
{
    var object = {};
    value.url = encrypt(value.url);
    object[key] = value;
    console.log(value.url);
    StorageArea.set(object);
}
function get(key)
{
    StorageArea.get(key, function(object)
    {
        console.log(decrypt(object[key].url));
    });
}




document.addEventListener("DOMContentLoaded", function(){alert("working");});


function link(address)
{
    this.accesses = {}; // array with the times accessed
    this.url = address;
    this.bookmarks = {};
    this.tags = {};
    this.session = {};
}



// encrypt and decrypt functions
function encrypt(value)
{
    var secret = "";
    for (var letter = 0; letter < value.length; letter++)
    {
        secret += cipher[value.charAt(letter)];
    }
    return secret;
}
function decrypt(value)
{
    var unsecret = "";
    for (var letter = 0; letter < value.length; letter++)
    {
        unsecret += cipher.getKeyByValue(value.charAt(letter));
    }
    return unsecret;
}



// debugging
// StorageArea.clear(function(){});
store("1", new link("http://www.google.com/"));
store("2", new link("http://www.facebook.com/"));
store("3", new link("http://www.imgur.com/"));
store("4", new link("http://www.reddit.com/"));
store("5", new link("http://www.cs.berkeley.edu/"));
store("6", new link("http://www.stackoverflow.com/"));
store("7", new link("http://www.ycombinator.com/"));
store("8", new link("http://www.piazza.com/"));
store("9", new link("http://bearfacts.berkeley.edu/"));
store("10", new link("http://calbears.imtrackonline.com/"));
get("1");



// helper functions
function setupCipher()
{
    var cipher = {};
    var codes = new Array();

    var i = 33;
    var letter;
    while (i < 128)
    {
        letter = String.fromCharCode(i);
        codes.push(letter);
        i++;
    }
    codes.push(" ");

    var valx, valy, x, y;
    while (codes.length > 2)
    {
        x = Math.floor(Math.random() * (codes.length - 1) + 1);
        y = Math.floor(Math.random() * (codes.length - 1) + 1);
        if (x == y)
        {
            continue;
        }
        valx = codes[x];
        valy = codes[y];
        cipher[valx] = valy;
        cipher[valy] = valx;
        codes.splice(x, 1);
        if (x > y)
        {
            codes.splice(y, 1);
        }
        else
        {
            codes.splice(y - 1, 1);
        }
    }
    cipher[codes[0]] = codes[1];
    cipher[codes[1]] = codes[0];
    
    // Debugging
    // console.log(cipher);
    // console.log(codes.length);
    // console.log(Object.keys(cipher).length);
    return cipher;
}

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