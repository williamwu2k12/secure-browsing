define(["/app/script/datastore.js",
        "/app/script/network.js",
        "/app/script/helper.js"],

function(Datastore, Network, Helper) {

    function Interest(name) {

        function init_class() {
            if (Interest.setup) {
                return;
            }
            Interest.yes        = [1.0];
            Interest.no         = [0.0];
            Interest.negatives  = 20;
            Interest.setup      = true;
        }

        function init(self) {
            if (name == undefined) {
                return;
            }
            self.net = new Network(name, {
                "layers": [100, 50, 10],
                "yes_iters": Interest.negatives,
                "no_iters": 1
            });
            self.feature_funcs = [Interest.feature_char_counts,
                                  Interest.feature_html_length,
                                  Interest.feature_char_sum,
                                  function() {return 1.0}]; /* ones-column acts as a normalizing feature */
            self.feature_count = self.net.featurize("", self.feature_funcs).length;
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
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 `~!@#$%^&*()-_=+[{]}\|;:'\",<.>/?\s\n\r\t".split("");

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
            features.push(char_counts[chars[i]] / string.length);
        }
        return features;
    }

    Interest.feature_html_length = function(string) {
        return [string.length];
    }

    Interest.feature_char_sum = function(string) {
        var sum = 0.0;
        for (var i = 0; i < string.length; i++) {
            sum += string[i].charCodeAt(0);
        }
        return [sum];
    }

    Interest.feature_image_count = function(string) {
        return [];
    }

    Interest.feature_video_count = function(string) {
        return [];
    }

    Interest.parse_links = function(html, protocol, location) {
        var doc = document.createElement("html");
        doc.innerHTML = html;
        var links = doc.getElementsByTagName("a");
        var ext_id = chrome.runtime.id;

        var ext_pfix = "chrome-extension://";
        var ext_href = ext_pfix + ext_id + "/", /* replace extension relative link with real link */
            real_href = null;
        for (var k = 0; k < links.length; k++) {
            real_href = links[k].href.substring(0, ext_href.length);
            if (real_href == ext_href) {
                links[k].href = location + links[k].href.substring(ext_href.length);
            } else if (links[k].href.substring(0, ext_pfix.length) == ext_pfix) {
                links[k].href = links[k].href.substring(ext_pfix.length);
            }
        }
        return links;
    }

    Interest.retrieve_html = function(url, callback) {
        var xml_req = new XMLHttpRequest();
        xml_req.onreadystatechange = function() {
            if (xml_req.readyState == 4 && xml_req.status == 200) {
                var response = xml_req.responseText;
                callback(response);
            }
        };
        xml_req.onerror = function() {};
        xml_req.open("GET", url, false);
        xml_req.send();
    }

    Interest.train_links = function(self, array, indices, i) {
        if (i >= indices.length) {
            return;
        }
        var url = array[indices[i]].href;
        p(url);
        Interest.retrieve_html(url, function(elem_html) {
            var features = self.net.featurize(elem_html, self.feature_funcs);
            self.net.train(features, Interest.no);
            Interest.train_links(self, array, indices, i + 1);
        });
    }

    Interest.prototype.train = function(html, protocol, elem, location) {
        var features = this.net.featurize(html, this.feature_funcs);
        this.net.train(features, Interest.yes);

        html = html.replace(elem, ""); /* remove clicked elem */
        var links = Interest.parse_links(html, protocol, location);
        var indices = [];
        for (var i = 0; i < links.length; i++) {
            indices.push(i);
        }
        Helper.shuffle(indices); /* shuffling links doesn't work for some reason */
        indices = indices.slice(0, Math.min(Interest.negatives, links.length));

        var self = this;
        Interest.train_links(self, links, indices, 0);
    }

    Interest.prototype.predict = function(data) {
        var features = this.net.featurize(data, this.feature_funcs);
        return this.net.predict(features);
    }

    Interest(); /* initialize */

    return Interest;
});