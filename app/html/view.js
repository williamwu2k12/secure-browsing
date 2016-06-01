document.onreadystatechange = function() {

    if (document.readyState == "complete") {

        var AUTH = "auth";
        var DEAUTH = "deauth";
        var TABLE = "link_table";
        var TABLE_SIZE = 5;

        function retrieve_elems() {

            var doc = {};
            doc.auth_form       = document.getElementById(AUTH);
            doc.signin_button   = doc.auth_form.signin;
            doc.signup_button   = doc.auth_form.signup;

            doc.deauth_form     = document.getElementById(DEAUTH);
            doc.signout_button  = doc.deauth_form.signout;

            doc.username_field  = doc.auth_form.username;
            doc.password_field  = doc.auth_form.password;

            return doc;
        }

        chrome.runtime.getBackgroundPage(function(background) {
            window.SB = background.SB;
            var SB = background.SB;
            var doc = retrieve_elems();

            if (SB.view == undefined) {
                SB.view = {
                    auth_display: doc.auth_form.style.display,
                    deauth_display: doc.auth_form.style.display
                }
            }

            function table_clear(table) {
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            function table_populate(table) {
                var value;
                SB.Account.user.history.count(function(num) {
                    SB.Account.user.history.get([num + 1 - TABLE_SIZE, num + 1], null, function(values) {
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
                    });
                });
            }

            doc.signin_button.onclick = function() {
                var doc = retrieve_elems();
                SB.Account.signin(doc.username_field.value, doc.password_field.value, function(success) {
                    if (success == true) {
                        var table = document.getElementById(TABLE);
                        table_clear(TABLE);

                        table_populate(table);
                        doc.auth_form.style.display = "none";
                        doc.deauth_form.style.display = SB.view.deauth_display;
                    }
                });
            };
            doc.signout_button.onclick = function() {
                var doc = retrieve_elems();
                SB.Account.signout(function(success) {
                    if (success == true) {
                        var table = document.getElementById(TABLE);
                        table_clear(table);
                        
                        doc.auth_form.style.display = SB.view.auth_display;
                        doc.deauth_form.style.display = "none";
                    }
                });
            };
            doc.signup_button.onclick = function() {
                var doc = retrieve_elems();
                SB.Account.signup(doc.username_field.value, doc.password_field.value, function(success) {
                    if (success == true) {
                        // alert or flash on success
                    }
                });
            };

            function wrap_reset(fn) {
                return function() {
                    var doc = retrieve_elems();
                    fn();
                    doc.auth_form.reset();
                    doc.deauth_form.reset();
                }
            }
            doc.signin_button.onclick = wrap_reset(doc.signin_button.onclick);
            doc.signout_button.onclick = wrap_reset(doc.signout_button.onclick);
            doc.signup_button.onclick = wrap_reset(doc.signup_button.onclick);


            if (SB.Account.auth == true) {
                doc.auth_form.style.display = "none";
                var table = document.getElementById(TABLE);
                table_clear(table);
                table_populate(table);
            } else {
                doc.deauth_form.style.display = "none";
                var fields = [doc.username_field, doc.password_field];
                for (var i = 0; i < fields.length; i++) {
                    fields[i].addEventListener("keyup", function(event) {
                        if (event.keyCode == 13) {
                            doc.signin_button.click();
                        }
                    });
                }
            }

            
        });

    }

}