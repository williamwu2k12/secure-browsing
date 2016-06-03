define(["/app/script/datastore.js",
        "/app/script/lib/brain/brain-0.6.3.js",
        "/app/script/lib/convnetjs/convnet.js"],

function(Datastore) {

    function Network(name, options) {

        function init_class() {
            if (Network.setup) {
                return;
            }
            Network.ds_name     = "network";
            Network.ds_key      = "weights";
            Network.setup       = true;
        }

        function init(self) {
            if (name == undefined) {
                return;
            }
            options = options != undefined ? options : {};
            self.name        = name;
            self.save_freq   = options.save_freq    || 1.0 / 25.0;
            self.save_count  = options.save_count   || 0.0;
            self.layers      = options.layers       || [10, 10]; /* [500, 100, 10] */
            self.rate        = options.rate         || 0.2;
            self.iterations  = options.iterations   || 1;

            self.net = new brain.NeuralNetwork({hiddenLayers: self.layers,
                                                learningRate: self.rate});
            self.ds = new Datastore(Network.ds_name + "." + self.name);
            self.ds.get(Network.ds_key, null, function(string) {
                if (string != undefined) {
                    self.import(JSON.parse(string));
                }
            });
        }

        init_class();
        init(this);
    }

    /*
      @purpose: combine the results of different feature functions on given data
      @param: <Object> data: the data to featurize
      @param: <Array> feature_funcs: a list of function pointers that each returns an array of floats
      @return: an array of floats
      @examples:
        var str_length = function(str) {return str.length;};
        var str_sum = function(str) {
            var sum = 0
            return str.split("").forEach(function(letter) {
                sum += letter.charCodeAt(0) - 64;
            });
        };
        var features = net.featurize(html, [str_length, str_sum]);
    */
    Network.prototype.featurize = function(data, feature_funcs) {
        var features = [];
        var func = undefined;
        for (var i = 0; i < feature_funcs.length; i++) {
            func = feature_funcs[i];
            features = features.concat(func(data));
        }
        return features;
    }

    /*
      @purpose: train on neural net given features and save to disk if necessary
      @param: <Array> features: a data point represented as an array of floats
      @param: <Array> label: the classification for the feature set, an array of floats
      @examples:
        var features = net.featurize(html, [str_length, str_sum]);
        var classification = 1.0;
        net.train(features, classification);
    */
    Network.prototype.train = function(features, label) {
        this.net.train([{input: features, output: label}],
                       {iterations: this.iterations});
        console.log("Success: trained on data.");

        if (this.save_count > 1.0 / this.save_freq) {
            this.ds.set(Network.ds_key, JSON.stringify(this.export()));
            console.log("Success: saved network weights to disk.");
            this.save_count = 0.0;
        }
        this.save_count += 1.0;
    }

    /*
      @purpose: estimate the label given the features
      @param: <Array> features: a data point represented as an array of floats
      @return: an array of floats representing the result prediction
      @examples:
        var label = net.predict([0.0, 1.0, 2.0, 3.0, 4.0])[0];
    */
    Network.prototype.predict = function(features) {
        return this.net.run(features);
    }

    /*
      @purpose: import json data into the internal neural network
      @param: <Object> json: an object of the same format as that returned from this.export()
      @examples:
        var json = net.export();
        // ... some code later ...
        net.import(json);
    */
    Network.prototype.import = function(json) {
        this.net.fromJSON(json);
    }

    /*
      @purpose: export the neural net to a saveable format
      @return: a json object
      @examples:
        var json = net.export();
    */
    Network.prototype.export = function() {
        return this.net.toJSON();
    }

    Network(); /* initialize */

    return Network;
});