// require(["/app/script/model.js"], function(SB) {
//     username = "will";
//     password = "pass";

//     var db = new SB.Database(username, password);
//     db.count(function(num) {
//         db.get([num - 20, num], null, function(values) {
//             for (var i in values) {
//                 var value = values[i];
//                 console.log(value);
//             }
//         });
//     });
// });




require(["/app/script/model.js"], function(SB) {

    var DB = SB.Database;
    DB.signin("user", "pass", function() {
        var value;
        DB.count(function(num) {
            DB.get([num - 20, num], null, function(values) {
                for (var i in values) {
                    value = values[i];
                    console.log(value);
                }
            });
        });
    });
})