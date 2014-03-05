////////////////////////////////
// Store and Get JSON Objects //
////////////////////////////////

function store(key, value)
{
    var object = {};
    data = encrypt(JSON.stringify(value));
    object[key] = data;
    StorageArea.set(object);
}

function get(key)
{
    StorageArea.get(key, function(object)
    {
        console.log(decrypt(object[key]));
        // console.log(decrypt(object[key].url));
    });
}

function link(address)
{
    this.url = address;
    this.accesses = [];
    // this.bookmarks = [];
    // this.tags = [];
    // this.session = [];
    // this.searches = [];
}

function storeTab()
{
    var address = location.href;
    var hyperlink = new link(address);
    var today = new Date();
    var date = {year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate(), hour: today.getHours(), minute: today.getMinutes(), second: today.getSeconds(), millseconds: today.getMilliseconds()};
    hyperlink.accesses.push(date);
    store(address, hyperlink);
    console.log("storing " + address + " succeeded");
}



///////////////////////////////////
// Encrypt and Decrypt Link Data //
///////////////////////////////////

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

function setupCipher()
{
    var cipher = {};
    var codes = setupChars();
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

function setupChars()
{
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
    codes.splice(1, 1);
    codes.splice(5, 1);
    codes.splice(57, 1);
    codes.splice(91, 1);
    return codes;
}



///////////////////////////
// Miscellaneous Helpers //
///////////////////////////

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