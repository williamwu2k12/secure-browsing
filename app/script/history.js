define(["/app/script/datastore.js",
        "/app/script/helper.js"], 

function(Datastore, Helper) {

    function History(name, username, password) {

        function init_class() {
            if (History.setup) {
                return;
            }
            History.ds_name = "history";
            History.setup   = true;
        }

        function init(self) {
            if (name == undefined) {
                return;
            }
            self.name       = name;
            self.username   = username;
            self.password   = password;

            self.ds = new Datastore(History.ds_name + "." + self.name);
        }

        init_class();
        init(this);
    }

    /*
      @purpose: Finds the current count of links in history, and handles the number in a callback.
      @param: <Function> callback(<Integer> num): function called after the count has been found
        @param: <Integer> num: the number of links in the history
      @examples:
        History.count(function(num) {
            if (num > 100000) {
                p("too many links in history!");
            }
        });
    */
    History.prototype.count = function(callback) {
        this.ds.count(callback);
    }

    /*
      @purpose: Gets an entry or a range of entries from an object store, and decrypts them.
      @param: <Integer> key: the numeric key of the entry to retrieve
              <Array> key: an array with two elements that specify the start and end of a range
      @param: <String> index_name [null]: the name of the index, use value null to use the default store keys
      @param: <Function> callback(<Array> objects): a function that processes a list of results
        @param: <Array> objects: an array of objects to be processed
      @examples:
        History.get(1, null, function(objects) {
            p(objects[0]);
        });
        History.get([1, 3], null, function(objects) {
            for (var i in objects) {
                var div = Document.createElement("div");
                div.text = objects[i];
                Document.appendChild(div);
            }
        })
    */
    History.prototype.get = function(key, index_name, callback) {
        var self = this;
        this.ds.get(key, index_name, function(cipher_texts) {
            var objects = [];
            var plain_text;

            if (!Array.isArray(cipher_texts)) {
                cipher_texts = [cipher_texts];
            }
            for (var i in cipher_texts) {
                plain_text = Helper.decrypt(cipher_texts[i], self.password);
                objects.push(JSON.parse(plain_text));
            }
            callback(objects);
        });
    };

    /*
      @purpose: Sets an encrypted key-item pair as an entry in the object store.
      @param: <Object> key: the key (usually the integer id) of the entry, which will not be encrypted
      @param: <Object> item: the item to associate with the key, which will be encrypted
      @param: <Function> callback(<Object> evt): a function that processes the resultant event
        @param: <Object> evt: the resultant event
      @note: callback function is not necessary
      @examples:
        History.set(3, {url: "https://facebook.com", title: "Facebook", time: 123});
    */
    History.prototype.set = function(key, item, callback) {
        var plain_text = JSON.stringify(item);
        var cipher_text = this.encrypt(plain_text, this.password);
        this.ds.set(key, ciphertext, callback);
    }

    /*
      @purpose: Encrypts and pushes an item to the end of the sorted object store, with this.count() + 1 as its index.
      @param: <Object> item: the item to push, which will be encrypted
      @param: <Function> callback(<Object> evt): a function that processes the resultant event
        @param: <Object> evt: the resultant event
      @note: callback function is not necessary
      @examples:
        History.push({url: "https://facebook.com", title: "Facebook", time: 123});
    */
    History.prototype.push = function(item, callback) {
        var plain_text = JSON.stringify(item);
        var cipher_text = Helper.encrypt(plain_text, this.password);
        this.ds.push(cipher_text, callback);
    };

    var check_funcs = [Helper.check_auth, Helper.check_callback];
        check_funcs = [Helper.check_callback];
    History.prototype.count = Helper.wrap_check(History.prototype.count, check_funcs);
    History.prototype.get   = Helper.wrap_check(History.prototype.get, check_funcs);
    History.prototype.set   = Helper.wrap_check(History.prototype.set, check_funcs);
    History.prototype.push  = Helper.wrap_check(History.prototype.push, check_funcs);

    History();

    return History;

});