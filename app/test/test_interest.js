require(["/app/script/model.js"], function(SB) {

    var test_basic = function() {
        var username = "a",
            password = "b";
        if (SB.Account.user == undefined) {
            SB.Account.signin(username, password, function(success) {});
        } else {
            var cases = ["abc",
                         "easy as 1 2 3".repeat(100),
                         "blah blah do re mi",
                         "Three of them fell into Japan's exclusive economic zone (EEZ) after flying some 1,000km (620 miles), in what PM Shinzo Abe called a 'new stage of threat'.\
They were fired from the Tongchang-ri region, near the North's border with China, the South Korean military said.\
The type of missile in unclear but the North is banned from any missile or nuclear tests by the UN.\
A South Korean military official said a launch had taken place at 07:36 local time Monday (22:36 GMT Sunday) and was being investigated to determine the type of projectile used.\
The US military said later it had detected and tracked a launch but had determined that it did not pose a threat to North America.\
On Friday, Pyongyang threatened to fire missiles in response to the Foal Eagle military exercises under way between South Korea and the US. The North sees the annual drills as preparation for an invasion against it.",
                         "1234567890".repeat(1000)];
            for (var i = 0; i < cases.length; i++) {
                var output = SB.Account.user.interest.predict(cases[i]);
                console.log("test" + i.toString() + " ".repeat(4 - i.toString().length) + output[0]);
            }
        }
    }

    SB.Test.Interest = {};
    SB.Test.Interest.test_basic = test_basic;
});