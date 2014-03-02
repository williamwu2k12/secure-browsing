
// StorageArea.set({"one": "please save this, thank you"}, function(){console.log});
// result = StorageArea.get("one");
// console.log(result);



chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  console.log(tabs[0].url);
});


var StorageArea = chrome.storage.local;
function store(key, value)
{
    StorageArea.set({key: value}, function(){console.log("value saved");});
}

function get(key)
{
    return StorageArea.get(key, function(){console.log("value received");});
}




// chrome.tabs.onCreated.addListener(function(tab)
// {
//     background.console.log("tab created");
// })

// chrome.tabs.onUpdated.addListener(function(id, info, tab)
// {
//     background.console.log(info.url);
// })

