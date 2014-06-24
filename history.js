var page = 0;



/********************
**  Login Options  **
********************/

function showMore()
{
    var button = document.createElement("input");
    button.type = "button";
    button.value = "Show More";
    button.className = "links";
    button.onclick = function()
    {
        button.parentNode.removeChild(button);
        chrome.storage.local.get(null, function(objects)
        {
            var linkKeys = objects["keys"];
            for (i = linkKeys.length - 1 - page * 100; i > -1 && i > linkKeys.length - 1 - 100 - (page * 100); i--)
            {
                var key = CryptoJS.AES.decrypt(linkKeys[i], objects["password"]).toString(CryptoJS.enc.Utf8);
                var object = CryptoJS.AES.decrypt(objects[linkKeys[i]], objects["password"]).toString(CryptoJS.enc.Utf8);
                addElement(key, object);
                // addElement(decrypt(linkKeys[i]), decrypt(objects[linkKeys[i]]));
            }
            page++;
            if (linkKeys[linkKeys.length - 1 - page * 100] != undefined)
            {
                showMore();
            }
        });
    }
    document.body.appendChild(button);
}

/**
* function showHistory()
* @purpose: shows the real history, iterating through the array of keys in storage
* @note: needs to be changed to reflect only recent elements
* @note: the keys may need to be sorted, but sorting millions of items will be time consuming
**/
function showHistory()
{
    chrome.storage.local.get(null, function(objects)
    {
        clearBody()
        var number = 100;
        var listkeys = objects["keys"];
        var i = listkeys.length - 1;
        var j;
        var value;
        var keys;
        while (number > 0 && i > -1)
        {
            keys = objects[listkeys[i]];
            j = keys.length - 1;
            while (number > 0 && j > -1)
            {
                value = CryptoJS.AES.decrypt(objects[keys[j]], objects["password"]).toString(CryptoJS.enc.Utf8);
                addElement(CryptoJS.AES.decrypt(keys[j], objects["password"]).toString(CryptoJS.enc.Utf8), value);
                number--;
                j--;
            }
            i--;
        }
        page++;
        showMore();
    });

    // chrome.storage.local.get(null, function(objects)
    // {
    //     clearBody();
    //     var linkKeys = objects["keys"];
    //     for (var i = linkKeys.length - 1; i > -1 && i > linkKeys.length - 1 - 100 - (page * 100); i--)
    //     {
    //         var key = CryptoJS.AES.decrypt(linkKeys[i], objects["password"]).toString(CryptoJS.enc.Utf8);
    //         var object = CryptoJS.AES.decrypt(objects[linkKeys[i]], objects["password"]).toString(CryptoJS.enc.Utf8);
    //         addElement(key, object);
    //         // addElement(decrypt(linkKeys[i]), decrypt(objects[linkKeys[i]]));
    //     }
    //     page++;
    //     if (linkKeys[linkKeys.length - 1 - page * 100] != undefined)
    //     {
    //         showMore();
    //     }
    // });
}

/**
* function showFakestory()
* @purpose: show fake history for emergency logins
**/
function showFakestory()
{
    clearBody();
    var createFakeLink = function()
    {
        for (var i = 0; i < 100; i++)
        {
            var object = {"url": "http://www.google.com", "tags": null};
            var newLink = document.createElement("div");
            newLink.innerHTML = object["url"];
            newLink.className = "links";
            document.body.appendChild(newLink);
        }
    }
    createFakeLink();
    var createButton = function()
    {
        button = document.createElement("input");
        button.type = "button";
        button.value = "Show More";
        button.className = "links";
        button.onclick = function()
        {
            button.parentNode.removeChild(button);
            createFakeLink();
            createButton();
        };
        document.body.appendChild(button);
    }
    createButton();
}

/**
* function clearBody()
* @purpose: clears all the elements of the class name "links" so that the body is not cluttered with old items
* @note: might be inefficient, check later
**/
function clearBody()
{
    page = 0;
    var elements = document.getElementsByClassName("links")
    var elementsLength = elements.length
    for (var i = 0; i < elementsLength; i++)
    {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

/**
* function initialize()
* @purpose: initializes the view with either the history, fake history, or nothing (depending on password previously entered)
* @note: to be finished, temporarily not implementing the cases because storage is unsecure
**/
function initialize()
{
    if (true)
    {
        showHistory();
    }
    else if (1)
    {
        showFakestory();
    }
    else if (2)
    {
        chrome.storage.local.clear();
    }
    else
    {
        alert("Username and password combination incorrect. Can not show history."); // we can also implement that if you try too many times, chrome.storage.local will automatically clear itself (good for preventing brute force attacks)
    }
}



/***********************
**  Helper Functions  **
***********************/

/**
* function addElement(objectArray, keyArray, index)
* @purpose: adds a link element to the body of history.html
* @param: objectArray: the array of objects to access, usually chrome.storage.local.get(null, function(objects))
* @param: keyArray: the array of keys
* @param: index: the index of the desired key in the keyArray
* @note: missing some abstraction possibly
* @note: lots of changes to this method, showHistory, and showMore, go back in commit history, updated 14.03.15
**/
function addElement(key, object)
{
    var newLink = document.createElement("div");
    var theLink = JSON.parse(object);
    newLink.innerHTML = key.substring(0, 2) + ":" + key.substring(2, 4) + ":" + key.substring(4, 6) + ":" + key.substring(6, 8) + ":" + key.substring(8, 10) + ":" + key.substring(10, 12) + ":" + key.substring(12, 15) + " : " + theLink["url"] + " : " + theLink["tags"] + " : " + theLink["state"];
    newLink.className = "links";
    document.body.appendChild(newLink);
}

initialize();