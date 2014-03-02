var StorageArea = chrome.storage.local;
var cipher = setupCipher();

function store(key, value)
{
    var object = {};
    var locked = encrypt(value);
    object[key] = locked;
    StorageArea.set(object);
}

function get(key)
{
    StorageArea.get(key, function(object)
    {
        console.log(object[key]);
    });
}

function encrypt(value)
{
    var secret = "";
    for (var letter = 0; letter < value.length; letter++);
    {
        secret.concat(cipher[value.charAt(letter)]);
    }
    console.log(value);
    console.log(secret);
    return secret;
}

function decrypt(value)
{
    return value;
}
StorageArea.clear(function(){});
store("one", "please save this, thank you");
get("one");











// chrome.tabs.onCreated.addListener(function(tab)
// {
//     background.console.log("tab created");
// })

// chrome.tabs.onUpdated.addListener(function(id, info, tab)
// {
//     background.console.log(info.url);
// })



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

    var valx, valy, x, y;
    while (codes.length > 1)
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
    cipher[codes[0]] = codes[0];

    // Debugging
    // console.log(cipher);
    // console.log(codes.length);
    // console.log(Object.keys(cipher).length);
    return cipher;
}