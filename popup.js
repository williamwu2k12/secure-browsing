function login(username, password)
{
    if (username == "william" && password == "secret")
    {
        document.getElementById("section1").style.display = "none";
        document.getElementById("section2").style.display = "initial";
        document.getElementById("section3").style.display = "initial";
        // var logout = document.createElement("button");
        // button.id = "logout";
        // document.getElementById("")
        chrome.storage.local.set({state: "logged in"});
    }
}

function logout()
{
    document.getElementById("section1").style.display = "initial";
    document.getElementById("section2").style.display = "none";
    document.getElementById("section3").style.display = "none";
    chrome.storage.local.set({state: "logged out"});
}

var loginForm = document.getElementById("loginForm");
var loginButton = document.getElementById("login");
loginButton.onclick = function(event)
{
    login(loginForm.username.value, loginForm.password.value);
}

var logoutButton = document.getElementById("logout");
logoutButton.onclick = function(event)
{
    logout();
}

/**
* @purpose: removes the login items and displays the menu and links items if already logged in
**/
chrome.storage.local.get("state", function(object)
{
    if (object["state"] == "logged in")
    {
        document.getElementById("section1").style.display = "none";
        document.getElementById("section2").style.display = "initial";
        document.getElementById("section3").style.display = "initial";
    }
});