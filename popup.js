console.log("figure out how to get links saved while in incognito (chrome.tabs.incognito). also, remember to turn left");
// StorageArea.set({"one": "please save this, thank you"}, function(){console.log});
// result = StorageArea.get("one");
// console.log(result);

var StorageArea = chrome.storage.local;

var cipher = {};

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
    secret.append()
    return value;
}

function decrypt(value)
{
    return value;
}
StorageArea.clear(function(){});
// store("one", "please save this, thank you");
// get("one");












// chrome.tabs.onCreated.addListener(function(tab)
// {
//     background.console.log("tab created");
// })

// chrome.tabs.onUpdated.addListener(function(id, info, tab)
// {
//     background.console.log(info.url);
// })

