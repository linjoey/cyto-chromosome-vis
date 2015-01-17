

var d3 = require("d3");
var $ = require("jquery");
var ModelLoader = require("./model-loader");


var Chromosome = (function () {
    "use strict";
    var chr = function (opt) {

        var DEFAULT_FEATURES_SOURCE = "http://www.ensembl.org/das/Homo_sapiens.GRCh38.karyotype";
        //var DEFAULT_REFERENCE_SOURCE = "http://www.ensembl.org/das/Homo_sapiens.GRCh38.reference";

        var defaultOptions = {
            dasSource : DEFAULT_FEATURES_SOURCE
        };
        this.options = $.extend({}, defaultOptions, opt || {});

        var modelLoader = new ModelLoader({
            source: this.options.dasSource,
            segment: this.options.segment
        });
        this.info = function () {
            console.log(this.options);
            modelLoader.loadModel(function(a){
                console.log(a);
            });
        };

    };

    return chr;
}());

require('biojs-events').mixin(Chromosome.prototype);
module.exports = Chromosome;
