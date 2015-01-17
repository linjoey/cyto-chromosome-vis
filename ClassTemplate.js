
var $ = require("jquery");

var ClassName = (function () {
    "use strict";
    //Private Static
    var ivar = 1;

    //Constructor
    var cls = function (opt) {
        //private
        var defaultOptions = {
            color : "one"
        };
        //public
        this.options = $.extend({}, defaultOptions, opt || {});
        this.info = function () {
            //
        };
    };

    //public static
    cls.func = function () {};

    return cls;
}());

module.exports = ClassName;