
var d3 = require("d3");

var Chromosome = (function () {

    var chromosome = function () {
        var local = "t";
        var test = "2";

        this.info = function () {
            return d3.version;
        };

        this.info2 = function () {
            return test;
        }
    };

    return chromosome;
})();

module.exports = Chromosome;