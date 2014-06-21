// var users = {}; // all items in dictionary MUST be encrypted, good idea to look for other methods of password storing

// /**********************
// **  Account Options  **
// **********************/

// function user(name, master, key1, key2)
// {
//     if (master == key1 || master == key2 || key1 == key2) // making sure no two passwords are the same
//     {
//         console.log("Passwords can not be the same")
//         return;
//     }
//     this.name = name;
//     this.password = master;
//     this.key1 = key1;
//     this.key2 = key2;
// }

// function createUser(name, master, key1, key2)
// {
//     var account = new user(name, master, key1, key2);
//     if (account != undefined)
//     {
//         users[name] = account;
//     }
//     else
//     {
//         console.log("Error creating account");
//     }
// }

// function changePassword(name, master, type, oldKey, newKey)
// {
//     var account = users[name];
//     if (account == undefined)
//     {
//         console.log("Invalid account name");
//         return;
//     }
//     if (master != account.password)
//     {
//         console.log("Invalid master password");
//         return;
//     }
//     if (type == "password")
//     {
//         account.password = newKey;
//     }
//     if (type == "key1" && account.key1 == oldKey)
//     {
//         account.key1 = newKey;
//     }
//     if (type == "key2" && account.key2 == oldKey)
//     {
//         account.key2 = newKey;
//     }
// }

// function deleteUser(name, master)
// {
//     if (users[name].password == master)
//     {
//         delete users[name];
//     }
//     else
//     {
//         console.log("Invalid master password");
//     }
// }

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

// createUser("william", "secret", "notsecret", "clear");





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
        document.getElementById("section1").style.display = "none";
        document.getElementById("section2").style.display = "initial";
        document.getElementById("section3").style.display = "initial";
        setRecents(10);
        chrome.storage.local.set({password: password});
    }
}

/**
* function logout()
* @purpose: removes all access to the current computer user from the account logged in
* @note: unsafe because the style and display of the sections can be changed by someone editing from chrome dev tools
**/
function logout()
{
    document.getElementById("section1").style.display = "initial";
    document.getElementById("section2").style.display = "none";
    document.getElementById("section3").style.display = "none";
    removeRecents();
    chrome.storage.local.set({password: ""});
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
    }
});

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
function setRecents(number)
{
    chrome.storage.local.get(null, function(objects)
    {
        var linkKeys = objects["keys"];
        var i = linkKeys.length - 1;
        while (number > 0 && i > -1)
        {
            // appendLink(objects[linkKeys[i]], objects[linkKeys[i]]);
            var object = JSON.parse(CryptoJS.AES.decrypt(objects[linkKeys[i]], objects["password"]).toString(CryptoJS.enc.Utf8));
            appendLink(object["url"], object["url"]);
            number--;
            i--;
        }
    });
}

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