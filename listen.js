// var test = "function thing()
// {
//     alert("yeeeee");
// }"
// var script = document.createElement("script");
// script.textContent = test;
// (document.head||document.documentElement).appendChild(script);
// script.parentNode.removeChild(script);

var code = '(' + function() {
    alert("Every time a new tab is opened, a new document is created in which this script is ran. This is the alert.");
    console.log("Every time a new tab is opened, a new document is created in which this script is ran. This is the console log.");
} + ')();';
var script = document.createElement('script');
script.textContent = code;
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);