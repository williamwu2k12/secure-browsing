/**********************
**  Account Options  **
**********************/

function user(name, master, key1, key2)
{
    if (master == key1 || master == key2 || key1 == key2) // making sure no two passwords are the same
    {
        console.log("Passwords can not be the same")
        return;
    }
    this.name = name;
    this.password = master;
    this.key1 = key1;
    this.key2 = key2;
}

function createUser(name, master, key1, key2)
{
    var account = new user(name, master, key1, key2);
    if (account != undefined)
    {
        chrome.storage.local.get("accounts", function(object)
        {
            var accounts = object["accounts"];
            var username = CryptoJS.SHA256(name);
            var details = CryptoJS.AES.encrypt(JSON.stringify(account), master).toString();
            if (accounts[username] == undefined)
            {
                accounts[username] = details;
                chrome.storage.local.set(object);
            }
            else
            {
                console.log("Error creating account");
            }
        });
    }
    else
    {
        console.log("Error creating account");
    }
}

function changePassword(name, master, type, oldKey, newKey)
{
    chrome.storage.local.get("accounts", function(object)
    {
        var accounts = object["accounts"];
        var account = accounts[CryptoJS.SHA256(name)];
        if (account == undefined)
        {
            console.log("Invalid account name");
            return;
        }
        var details = CryptoJS.AES.decrypt(account, master).toString(CryptoJS.enc.Utf8);
        if (details == "")
        {
            console.log("Invalid master password");
            return;
        }
        details = JSON.parse(details);
        if (type == "password")
        {
            details.password = newKey;
        }
        if (type == "key1" && details.key1 == oldKey)
        {
            details.key1 = newKey;
        }
        if (type == "key2" && details.key2 == oldKey)
        {
            details.key2 = newKey;
        }
        accounts[CryptoJS.SHA256(name)] = CryptoJS.AES.encrypt(JSON.stringify(details), details.password).toString();
        chrome.storage.local.set(object);
    });
}

function deleteUser(name, master)
{
    chrome.storage.local.get("accounts", function(object)
    {
        var accounts = object["accounts"];
        var account = accounts[CryptoJS.SHA256(name)];
        if (account == undefined)
        {
            return;
        }
        var details = CryptoJS.AES.decrypt(account, master).toString(CryptoJS.enc.Utf8);
        if (details == "")
        {
            return;
        }
        details = JSON.parse(details);
        if (details.password == master)
        {
            delete accounts[CryptoJS.SHA256(name)];
        }
        else
        {
            console.log("Invalid master password");
        }
    });
}

// /**
// * function login(name, password)
// * @purpose: displays the history according to the username and password
// * @param: name: the name of the user who wants to login
// * @param: password: the password of the user who wants to login
// * @note: should extend other options besides the basic three
// **/
// function login(name, password)
// {
//     if (password == users[name].password)
//     {
//         showHistory();
//     }
//     else if (password == users[name].key1)
//     {
//         showFakestory();
//     }
//     else if (password == users[name].key2)
//     {
//         chrome.storage.local.clear();
//     }
//     else
//     {
//         alert("Username and password combination incorrect. Please try again."); // we can also implement that if you try too many times, chrome.storage.local will automatically clear itself (good for preventing brute force attacks)
//     }
// }

createUser("william", "secret", "notsecret", "clear");



/*******************
**  Login/Logout  **
*******************/

/**
* function login(username, password)
* @purpose: provides limited, full, or no access to a user based on their username and password combination
* @note: can implement a count
* @note: need to figure out a safe way to access and store the password data
**/
function login(username, password)
{
    if (true)
    {
        chrome.storage.local.set({username: username});
        chrome.storage.local.set({password: password});
        document.getElementById("section1").style.display = "none";
        document.getElementById("section2").style.display = "initial";
        document.getElementById("section3").style.display = "initial";
        setRecents(10);
        // setRecents(10, new Date());
    }
}

/**
* function logout()
* @purpose: removes all access to the current computer user from the account logged in
* @note: unsafe because the style and display of the sections can be changed by someone editing from chrome dev tools
**/
function logout()
{
    chrome.storage.local.set({username: ""});
    chrome.storage.local.set({password: ""});
    document.getElementById("section1").style.display = "initial";
    document.getElementById("section2").style.display = "none";
    document.getElementById("section3").style.display = "none";
    removeRecents();
}

/**
* @purpose: adds the onclick calling the login function
**/
var loginForm = document.getElementById("loginForm");
var loginButton = document.getElementById("login");
loginButton.onclick = function(event)
{
    login(loginForm.username.value, loginForm.password.value);
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

/**
* @purpose: attaches a onclick to the logout button calling the logout function
**/
var logoutButton = document.getElementById("logout");
logoutButton.onclick = function(event)
{
    logout();
}

/**
* @purpose: removes the login items and displays the menu and links items if already logged in
**/
chrome.storage.local.get("password", function(object)
{
    removeRecents();
    if (object["password"] != "")
    {
        document.getElementById("section1").style.display = "none";
        document.getElementById("section2").style.display = "initial";
        document.getElementById("section3").style.display = "initial";
        setRecents(10);
        // setRecents(10, new Date());
    }
});




/*******************
**  Link Display  **
*******************/

/**
* function appendLink(link, title)
* @purpose: adds a table cell to the linkTable
* @param: link: a string of the actual url
* @param: title: the title of the document, possibly document.title
**/
function appendLink(link, title)
{
    var linkTable = document.getElementById("linkTable");
    var row = linkTable.insertRow(linkTable.rows.length);
    var cell = row.insertCell(0);
    var content = document.createElement("a");
    content.href = link;
    content.target = "_blank";
    content.appendChild(document.createTextNode(title));
    cell.className = "link";
    cell.appendChild(content);
}

/**
* @purpose: adds number entries to recently visited links
**/
// function setRecents(number)
// {
//     chrome.storage.local.get(null, function(objects)
//     {
//         var linkKeys = objects["keys"];
//         var i = linkKeys.length - 1;
//         var object;
//         while (number > 0 && i > -1)
//         {
//             // appendLink(objects[linkKeys[i]], objects[linkKeys[i]]);
//             object = JSON.parse(CryptoJS.AES.decrypt(objects[linkKeys[i]], objects["password"]).toString(CryptoJS.enc.Utf8));
//             appendLink(object["url"], object["title"]);
//             number--;
//             i--;
//         }
//     });
// }


function setRecents(number)
{
    chrome.storage.local.get(null, function(objects)
    {
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
                value = JSON.parse(CryptoJS.AES.decrypt(objects[keys[j]], objects["password"]).toString(CryptoJS.enc.Utf8));
                appendLink(value["url"], value["title"]);
                number--;
                j--;
            }
            i--;
        }
    });
}


// function setRecents(number, date)
// {
//     chrome.storage.local.get(null, function(objects)
//     {
//         var keys = objects["keys" + convertDate(date)];
//         if (keys != undefined)
//         {
//             var i = keys.length - 1;
//             var value;
//             while (number > 0 && i > -1)
//             {
//                 value = JSON.parse(CryptoJS.AES.decrypt(objects[keys[i]], objects["password"]).toString(CryptoJS.enc.Utf8));
//                 appendLink(value["url"], value["title"]);
//                 number--;
//                 i--;
//             }
//             if (number > 0 && date.getFullYear() > 2010)
//             {
//                 date.setDate(date.getDate() - 1);
//                 setRecents(number, date);
//             }
//         }
//         else if (date.getFullYear() > 2010)
//         {
//             date.setDate(date.getDate() - 1);
//             setRecents(number, date);
//         }
//     });
// }

/**
* @purpose: removes all entries in recently visited links
**/
function removeRecents()
{
    var linkTable = document.getElementById("linkTable");
    while (linkTable.rows.length > 0)
    {
        linkTable.deleteRow(0);
    }
}




/**
* function convertDate()
* @purpose: converts the date format to a string with only integers
* @note: in history.js, the returned value of this is spliced with ":" for better viewing
**/
function convertDate(date)
{
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10)
    {
        month = "0" + month;
    }
    if (day < 10)
    {
        day = "0" + day;
    }
    return "" + date.getFullYear().toString().substring(2, 4) + month + day;
}