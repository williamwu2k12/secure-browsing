require(["/app/script/datastore.js"],

function(Datastore) {
    function assert(expected, actual) {
        if (expected == actual) {
            console.log("success")
        } else {
            console.log("failure")
            throw new Error("failure");
        }
    }
});