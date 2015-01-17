
var $ = require("jquery");
var JSDAS = require('biojs-rest-jsdas');

var ModelLoader = (function () {
    "use strict";

    var mdl = function (opt) {


        var error_handler = function() {
            console.log("DAS Load Fail");
        };

        this.loadModel = function (cb) {

            JSDAS.Simple.getClient(opt.source).features({segment: opt.segment}, function (res) {
                //success response
                cb({
                    id : res.GFF.SEGMENT[0].id,
                    start : res.GFF.SEGMENT[0].start,
                    stop : res.GFF.SEGMENT[0].stop,
                    bands : res.GFF.SEGMENT[0].FEATURE
                });

            }, function () {
                //error response handler
                cb({err:"DAS Loading error"});
            });
        };
        this.info = function () {

        };
    };

    return mdl;
}());

module.exports = ModelLoader;