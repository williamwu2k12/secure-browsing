document.onreadystatechange = function() {

    if (document.readyState == "complete") {

        chrome.runtime.getBackgroundPage(function(background) {
            var SB = background.SB;
            var DB = SB.Database;

            var AUTH = "auth";
            var DEAUTH = "deauth";
            var TABLE = "link_table";
            var TABLE_SIZE = 5;

            auth_form = document.getElementById(AUTH);
            signin_button = auth_form.signin;
            signup_button = auth_form.signup;

            deauth_form = document.getElementById(DEAUTH);
            signout_button = deauth_form.signout;

            username = auth_form.username;
            password = auth_form.password;

            var auth_display = auth_form.style.display;
            var deauth_display = deauth_form.style.display;


            function clear_table(table) {
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            function append_rows(table) {
                var value;
                DB.count(function(num) {
                    DB.get([num + 1 - TABLE_SIZE, num + 1], null, function(values) {
                        for (var i in values) {
                            value = values[i];
                            var tr = document.createElement("tr");
                            var a = document.createElement("a");
                            var txt = document.createTextNode(JSON.stringify(value.title));
                            a.appendChild(txt);
                            a.href = JSON.stringify(value.url);
                            tr.appendChild(a);
                            table.appendChild(tr);
                        }
                        auth_form.style.display = "none";
                        deauth_form.style.display = deauth_display;
                    });
                });
            }

            signin_button.onclick = function() {
                DB.signin(username.value, password.value, function(success) {
                    if (success == true) {
                        var table = document.getElementById(TABLE);
                        clear_table(TABLE);

                        append_rows(table);
                    }
                });
            };
            signout_button.onclick = function() {
                DB.signout(function(success) {
                    if (success == true) {
                        var table = document.getElementById(TABLE);
                        clear_table(table);
                        auth_form.style.display = auth_display;
                        deauth_form.style.display = "none";
                    }
                });
            };
            signup_button.onclick = function() {
                DB.signup(username.value, password.value, function(success) {
                    if (success == true) {
                        // alert or flash on success
                    }
                });
            };

            function wrap_reset(fn) {
                return function() {
                    fn();
                    auth_form.reset();
                    deauth_form.reset();
                }
            }
            signin_button.onclick = wrap_reset(signin_button.onclick);
            signout_button.onclick = wrap_reset(signout_button.onclick);
            signup_button.onclick = wrap_reset(signup_button.onclick);


            if (DB.auth == true) {
                auth_form.style.display = "none";
                var table = document.getElementById(TABLE);
                clear_table(table);
                append_rows(table);
            } else {
                deauth_form.style.display = "none";
            }

            
        });

    }

}