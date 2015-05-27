
//var $ = require("jquery");
var d3 = require("d3");
var assign = require('lodash.assign');

var Selector = (function () {
    "use strict";

    var sel = function (opt) {

        var self = this,
            _selector,
            _brush,
            _initialized;

        var AXIS_SPACING = 4;

        var _options = (function () {
            return assign({}, {
                //DEFAULT OPTIONS
                height: 20,
                y:9
            }, opt || {});
        }());

        this.delete = function () {
            _selector.remove();
            _initialized = false;
        };

        function triggerSelectionChange () {
            var ext = _brush.extent();
            self.trigger("selectionChanged", {
                start: ext[0],
                end: ext[1]
            });
        }

        this.init = function (start, end) {
            _brush = d3.svg.brush()
                .x(_options.xscale)
                .extent([start, end]);

            _brush.on("brush", function () {
                triggerSelectionChange();
            });

            _brush.on("brushend", function () {
                triggerSelectionChange();
            });

            _selector = d3.select(_options.target).append("g")
                .classed('selector', true)
                .attr('transform',"translate(0,"+ _options.y +")")
                .call(_brush);

            _selector.selectAll('rect')
                .attr('height', _options.height + (AXIS_SPACING * 2));

            _initialized = true;
            return self;
        };

        this.getSelectedCoords = function() {
            return _brush.extent();
        };

        this.draw = function () {
            if (!_initialized) self.init();
            _selector.select('.background').remove();
            _selector.call(_brush);
            return self;
        };

        this.move = function (to, from) {
            _brush.extent([to, from]);
            var selector = d3.select(_options.target + ' .selector');
            selector.call(_brush);
            return self;
        };
    };

    return sel;
}());

require('biojs-events').mixin(Selector.prototype);
module.exports = Selector;