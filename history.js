var cipher = { '0': 't', '1': 'S', '2': ' ', '3': 'm', '4': '9', '5': 'L', '6': 'h', '7': 'q', '8': 'B', '9': '4', u: 'd', d: 'u', '<': 'W', W: '<', m: '3', '$': '(', '(': '$', ' ': '2', B: '8', Q: '#', '#': 'Q', '[': ',', ',': '[', N: '\'', '\'': 'N', v: 'O', O: 'v', s: '?', '?': 's', ')': '`', '`': ')', '>': '}', '}': '>', q: '7', E: 'Z', Z: 'E', H: 'V', V: 'H', '.': '|', '|': '.', S: '1', D: 'y', y: 'D', n: '^', '^': 'n', '&': ':', ':': '&', J: '_', _: 'J', K: 'b', b: 'K', c: 'g', g: 'c', X: 'f', f: 'X', T: '-', '-': 'T', h: '6', r: '/', '/': 'r', '*': 'k', k: '*', M: '%', '%': 'M', I: 'i', i: 'I', '+': 'p', p: '+', R: ';', ';': 'R', j: 'l', l: 'j', U: 'w', w: 'U', '~': 'z', z: '~', t: '0', L: '5', ']': '=', '=': ']', '{': 'F', F: '{', e: 'P', P: 'e', '"': 'a', a: '"', o: 'x', x: 'o', '@': 'Y', Y: '@', '\\': 'G', G: '\\', C: '', '': 'C', '!': 'A', A: '!' };
var page = 0;
var users = {}; // all items in dictionary MUST be encrypted, good idea to look for other methods of password storing



/**********************
**  Account Options  **
**********************/

function createUser(name, password)
{

}

function changePassword(name, oldPassword, newPassword)
{

}

function deleteUser(name, password)
{

}



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
            var i;
            var keys = Object.keys(objects);
            for (i = page * 30; i < (page * 30) + 30 && i < keys.length; i++)
            {
                addElement(objects, keys, i);
            }
            if (i >= keys.length)
            {
                button.parentNode.removeChild(button);
            }
            page++;
            showMore();
        });
    }
    document.body.appendChild(button);
}


function addElement(objectArray, keyArray, index)
{
    var object = JSON.parse(decrypt(objectArray[keyArray[index]]));
    var newLink = document.createElement("div");
    newLink.innerHTML = object["url"];
    newLink.className = "links";
    document.body.appendChild(newLink);
}


/**
* function showHistory()
* @purpose: shows the real history, iterating through the array of keys in storage
* @note: needs to be changed to reflect only recent elements
**/
function showHistory()
{
    chrome.storage.local.get(null, function(objects)
    {
        clearBody();
        var keys = Object.keys(objects);
        for (var i = page * 30; i < (page * 30) + 30 && i < keys.length; i++)
        {
            addElement(objects, keys, i);
        }
        page++;
        showMore();
    });
}

/**
* function showHerstory()
* @purpose: show fake history for emergency logins
* @note: name may be bad for publicity, probably a good idea to change, but it's funny
**/
function showHerstory()
{
    clearBody();
    var createFakeLink = function()
    {
        for (var i = 0; i < 30; i++)
        {
            var object = {"url": "http://www.google.com", "accesses": []};
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
* function login(name, password)
* @purpose: displays the history according to the username and password
* @param: name: the name of the user who wants to login
* @param: password: the password of the user who wants to login
* @note: should extend other options besides the basic three
**/

function login(name, password)
{
    if (name == "William" && password == "secret")
    {
        showHistory();
    }
    else if (name == "William" && password == "notsecret")
    {
        showHerstory();
    }
    else if (name == "William" && password == "doomsday")
    {
        chrome.storage.local.clear();
    }
    else
    {
        alert("Username and password combination incorrect. Please try again.") // we can also implement that if you try too many times, chrome.storage.local will automatically clear itself (good for preventing brute force attacks)
    }
}



/****************
**  Listeners  **
****************/

/**
* function onSubmitted()
* @purpose: function that will draw out the name and password from the form
* @note: should consider the security of this function, and of the document, since the password and username can be withdrawn
**/
function onSubmitted()
{
    document.getElementById("login").addEventListener("submit", function(event)
    {
        event.preventDefault();
        var userData = [];
        for (var i = 0, j = this.childNodes.length; i < j; i++)
        {
            if (this.childNodes[i].value != "" && this.childNodes[i].value != undefined)
            {
                userData.push(this.childNodes[i].value);
            }
        }
        login(userData[0], userData[1]);
    })
}

/**
* @purpose: adds listener to find out when the submit button pressed
**/
window.addEventListener("load", onSubmitted, false);