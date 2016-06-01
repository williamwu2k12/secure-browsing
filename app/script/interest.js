define(["/app/script/datastore.js",
        "/app/script/network.js"],

function(Datastore, Network) {

    function Interest(name) {

        function init_class() {
            if (Interest.setup) {
                return;
            }
            Interest.yes        = 1;
            Interest.no         = 0;
            Interest.setup      = true;
        }

        function init(self) {
            if (name == undefined) {
                return;
            }
            self.net = new Network(name);
            self.feature_funcs = [Interest.feature_char_counts,
                                  Interest.feature_html_length,
                                  function() {return 1.0}]; /* ones-column acts as a normalizing feature */
        }

        init_class();
        init(this);
    }


    Interest.feature_word_count = function(string) {
        var words = string.split(/[\s\n\r\t]+/);
        words = words.filter(function(word) {return word != ""});
        words = words.map(function(word) {return word.replace(/\W/g, "");});
            return [words.length];
    }

    Interest.feature_char_counts = function(string) {
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 ".split("");

        var char_counts = {};
        for (var i = 0; i < chars.length; i++) {
            char_counts[chars[i]] = 0;
        }
        for (var i = 0; i < string.length; i++) {
            if (string[i] in char_counts) {
                char_counts[string[i]] += 1;
            }
        }

        var features = [];
        for (var i = 0; i < chars.length; i++) {
            features.push(char_counts[chars[i]]);
        }
        return features;
    }

    Interest.feature_html_length = function(string) {
        return [string.length];
    }

    Interest.parse_links = function(html, protocol) {
        var doc = document.createElement("html");
        doc.innerHTML = html;
        var links = doc.getElementsByTagName("a");
        for (var k = 0; k < links.length; k++) {
            if (links[k].href.substring(0, 17) == "chrome-extension:") {
                links[k].href = protocol + links[k].href.substring(17)
            }
        }
        return links;
    }

    Interest.retrieve_html = function(url, callback) {
        var xml_req = new XMLHttpRequest();
        xml_req.onreadystatechange = function() {
            if (xml_req.readyState == 4 && xml_req.status == 200) {
                var response = xml_req.responseText;
                var html = document.createElement("html");
                html.innerHTML = response;
                var i = 0;
                while (i < html.children.length) {
                    if (html.children[i].tagName.toLowerCase() == "head") {
                        html.children[i].remove();
                        continue;
                    }
                    i += 1;
                }
                var raw_text = html.textContent;
                callback(raw_text);
            }
        }
        url = "https://www.example.com";
        xml_req.open("GET", url, false);
        xml_req.send();
    }


    Interest.prototype.train = function(html, protocol, elem) {
        var features = this.net.featurize(html, this.feature_funcs);
        this.net.train(features, Interest.yes);
        return;
        
        var links = Interest.parse_links(html, protocol);
        for (var k = 0; k < links.length; k++) {
            var url = links[k].href;
            var e = document.createElement("div");
            e.outerHTML = elem;
            if (url != e.href) { /* check if not the clicked element */
                Interest.retrieve_html(url, function(elem_html) {
                    var features = this.net.featurize(elem_html);
                    this.net.train(features, Interest.no);
                });
            }
        }

    }

    /* TO BE EVENTUALLY DONE */
    Interest.prototype.predict = function(data) {
        var features = this.net.featurize(data, this.feature_funcs);
        return this.net.predict(features);
    }

    Interest(); /* initialize */

    return Interest;
});