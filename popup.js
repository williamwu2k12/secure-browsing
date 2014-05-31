function login(username, password)
{
    if (username == "william" && password == "secret")
    {
        document.getElementById("login").style.display = "none";
        document.getElementById("menu").style.display = "initial";
        document.getElementById("links").style.display = "initial";
        chrome.extension.getBackgroundPage().state = "logged in";
    }
}

function logout()
{
    document.getElementById("login").style.display = "initial";
    document.getElementById("menu").style.display = "none";
    document.getElementById("links").style.display = "none";
    chrome.extension.getBackgroundPage().state = "logged out";
}

function onSubmitted()
{
    document.getElementById("userinfo").addEventListener("submit", function(event)
    {
        event.preventDefault();
        login(this.username.value, this.password.value);
    });
}

/**
* @purpose: adds listener to find out when the submit button pressed
**/
window.addEventListener("load", onSubmitted, false);

/**
* @purpose: removes the login items and displays the menu and links items if already logged in
**/
chrome.runtime.getBackgroundPage(function(backgroundPage)
{
    if (backgroundPage.state == "logged in")
    {
        document.getElementById("login").style.display = "none";
        document.getElementById("menu").style.display = "initial";
        document.getElementById("links").style.display = "initial";
    }
});