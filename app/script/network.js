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

    Network.prototype.featurize = function(data, feature_funcs) {
        var features = [];
        var func = undefined;
        for (var i = 0; i < feature_funcs.length; i++) {
            func = feature_funcs[i];
            features = features.concat(func(data));
        }
        return features;
    }

    Network.prototype.train = function(features, label) {
        this.net.train([{input: features, output: label}],
                       {iterations: this.iterations});
        console.log("Success: trained on data.");

        if (this.save_count > 1.0 / this.save_freq) {
            this.ds.set(Network.ds_key, JSON.stringify(this.export()));
            console.log("Success: saved network weights to disk.");
            this.save_count = 0.0;
        }
        this.save_count += 1;
    }

    Network.prototype.predict = function(features) {
        return this.net.run(features);
    }

    Network.prototype.import = function(json) {
        this.net.fromJSON(json);
    }

    Network.prototype.export = function() {
        return this.net.toJSON();
    }

    Network(); /* initialize */

    return Network;
});