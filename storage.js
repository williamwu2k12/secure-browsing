////////////////////////////////
// Store and Get JSON Objects //
////////////////////////////////

function store(key, value)
{
    var object = {};
    var accessor = encrypt(key);
    var data = encrypt(JSON.stringify(value));
    object[accessor] = data;
    StorageArea.set(object);
}

function get(key)
{
    StorageArea.get(key, function(object)
    {
        console.log(decrypt(object[decrypt(key)]));
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
    var date = {year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate(), hour: today.getHours(), minute: today.getMinutes(), second: today.getSeconds(), milliseconds: today.getMilliseconds()};
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






































// var cipher = { '0': 't',
//   '1': 'S',
//   '2': ' ',
//   '3': 'm',
//   '4': '9',
//   '5': 'L',
//   '6': 'h',
//   '7': 'q',
//   '8': 'B',
//   '9': '4',
//   u: 'd',
//   d: 'u',
//   '<': 'W',
//   W: '<',
//   m: '3',
//   '$': '(',
//   '(': '$',
//   ' ': '2',
//   B: '8',
//   Q: '#',
//   '#': 'Q',
//   '[': ',',
//   ',': '[',
//   N: '\'',
//   '\'': 'N',
//   v: 'O',
//   O: 'v',
//   s: '?',
//   '?': 's',
//   ')': '`',
//   '`': ')',
//   '>': '}',
//   '}': '>',
//   q: '7',
//   E: 'Z',
//   Z: 'E',
//   H: 'V',
//   V: 'H',
//   '.': '|',
//   '|': '.',
//   S: '1',
//   D: 'y',
//   y: 'D',
//   n: '^',
//   '^': 'n',
//   '&': ':',
//   ':': '&',
//   J: '_',
//   _: 'J',
//   K: 'b',
//   b: 'K',
//   c: 'g',
//   g: 'c',
//   X: 'f',
//   f: 'X',
//   T: '-',
//   '-': 'T',
//   h: '6',
//   r: '/',
//   '/': 'r',
//   '*': 'k',
//   k: '*',
//   M: '%',
//   '%': 'M',
//   I: 'i',
//   i: 'I',
//   '+': 'p',
//   p: '+',
//   R: ';',
//   ';': 'R',
//   j: 'l',
//   l: 'j',
//   U: 'w',
//   w: 'U',
//   '~': 'z',
//   z: '~',
//   t: '0',
//   L: '5',
//   ']': '=',
//   '=': ']',
//   '{': 'F',
//   F: '{',
//   e: 'P',
//   P: 'e',
//   '"': 'a',
//   a: '"',
//   o: 'x',
//   x: 'o',
//   '@': 'Y',
//   Y: '@',
//   '\\': 'G',
//   G: '\\',
//   C: '',
//   '': 'C',
//   '!': 'A',
//   A: '!' };