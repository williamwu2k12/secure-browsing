require(["/app/script/datastore.js"],

function(Datastore) {
    function assert(expected, actual) {
        if (expected == actual) {
            console.log("success")
            return true;
        } else {
            console.log("failure")
            return false;
        }
    }

    var setup = function(callback) {
        var schema = {
            stores: [
                {
                    name: "test",
                    increment: true,
                    indexes: []
                }
            ]
        };
        Datastore().open(schema);
    }

    var teardown = function(callback) {
        indexedDB.deleteDatabase("secure_browsing");
    }

    var test_count = function(callback) {
        success = true;

        ds = new Datastore("test");
        ds.count(function(num1) {
            success = success && assert(0, num1);

            ds.push("test");
            ds.count(function(num2) {
                success = success && assert(1, num2);
                callback();
            });
        });
    }

    var test_get = function(callback) {
        
    }

    var test_set = function(callback) {

    }

    var test_push = function(callback) {

    }

    var test_pop = function(callback) {

    }

    var test_remove = function(callback) {

    }

    var test_clear = function(callback) {

    }

    function wrap_test(fn) {
        return function(next) {
            setup(fn(teardown(next))); // setup must happen before fn, which must happen before teardown
        }
    }

    var tests = [test_count, test_get, test_set, test_push, test_pop, test_remove, test_clear];
    var test;
    for (var i in tests) {
        test = tests[i];
        tests[i] = wrap_test(test);
    }

    function test_all(tests, i) {
        if (i >= 0) {
            tests[i](test_all(tests, i - 1));
        }
    }

    test_all(tests, tests.length);

});