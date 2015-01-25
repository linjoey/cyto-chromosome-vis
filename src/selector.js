
var $ = require("jquery");
var d3 = require("d3");

var Selector = (function () {
    "use strict";

    var sel = function (opt) {

        var self = this,
            _selector,
            _brush,
            _initialized;

        var AXIS_SPACING = 4;

        var options = (function () {
            return $.extend({}, {
                //DEFAULT OPTIONS
                height: 20,
                y:9
            }, opt || {});
        }());

        this.delete = function () {
            _selector.remove();
            _initialized = false;
        };

        this.init = function (start, end) {
            _brush = d3.svg.brush()
                .x(options.xscale)
                .extent([start, end]);

            _selector = d3.select(options.target).append("g")
                .classed('selector', true)
                .attr('transform',"translate(0,"+ options.y +")")
                .call(_brush);

            _selector.selectAll('rect')
                .attr('height', options.height + (AXIS_SPACING * 2));

            _initialized = true;
            return self;
        };

        this.draw = function () {
            if (!_initialized) self.init();
            _selector.select('.background').remove();
            _selector.call(_brush);
            return self;
        };

        this.move = function (to, from) {
            _brush.extent([to, from]);
            var selector = d3.select(options.target + ' .selector');
            selector.call(_brush);
            return self;
        };
    };

    return sel;
}());

module.exports = Selector;