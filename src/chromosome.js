/**
 * INTERACTIVE CHROMOSOME VISUALIZATION
 * opt : initialization options object
 *  + target:
 *  + segment:
 *  - dasSource:
 *  - width:
 *
 *
 */

var d3 = require("d3");
var $ = require("jquery");
var ModelLoader = require("./model-loader");
var Selector = require("./selector.js");

var Chromosome = (function () {
    "use strict";
    var chr = function (opt) {

        var self = this,
            CHR1_BP_END = 248956422,
            STALK_MAG_PC = 0.8,
            PADDING = 30,
            LABEL_PADDING = 24,
            AXIS_SPACING = 4,
            STALK_SPACING = 3;

        var _options = (function () {
            return $.extend({}, {
                //DEFAULT OPTIONS
                dasSource : "http://www.ensembl.org/das/Homo_sapiens.GRCh38.karyotype",
                width: 900,
                height: 20,
                relativeSize: false,
                includeAxis: false,
                selectionMode: "single"
            }, opt || {});
        }());

        var _modelLoader = new ModelLoader({
            source: _options.dasSource,
            segment: _options.segment
        });

        this.selectors = {
            ary: new Array(),
            deleteAll: function () {
                for (var i = 0; i < this.ary.length; i++) {
                    this.ary[i].delete();

                }
                this.ary.length = 0;
            }
        };

        this.info = function () {
            return _options;
        };

        this.moveSelectorTo = function (to, from) {
            if (_options.selectionMode!=="none") {
                _brush.extent([to, from]);
                var selector = d3.select(_options.target + ' .selector');
                selector.call(_brush);


            }
        };

        this.getCurrentSelection = function () {
            if (_options.selectionMode!=="none" && (typeof _brush !== 'undefined')) {
                var ar = _brush.extent();
                return {
                    start: ar[0],
                    end: ar[1]
                };
            }
        };

        function newSelector(xscale, start, end, yshift) {
            return new Selector({
                xscale: xscale,
                y: yshift,
                target: _options.target
            }).init(start, end);
        };

        this.draw = function () {
            _modelLoader.loadModel(function (model) {
                //console.log(model);
                if (typeof model.err === 'undefined') {
                    $(function () {
                        var rangeTo = _options.relativeSize
                            ? ((+model.stop / CHR1_BP_END) * _options.width) - PADDING
                            : _options.width - PADDING;

                        var scaleFn = d3.scale.linear()
                            .domain([model.start, model.stop])
                            .range([0, rangeTo]);

                        var visTarget = d3.select(_options.target)
                            .attr('width', _options.width)
                            .attr('height', _options.height + (2 * PADDING));

                        if (!visTarget.empty()) {

                            var band = visTarget.selectAll(_options.target + " g")
                                .data(model.bands)
                                .enter().append("g");

                            //band.append("title")
                            //    .text(function(m) {return m.id; });

                            band.append('rect')
                                .attr('class', function (m) {
                                    return m.TYPE.id.replace(':', ' ');
                                })
                                .attr('height', function (m) {
                                    return (m.TYPE.id === "band:stalk") ? (_options.height * STALK_MAG_PC) : _options.height;
                                })
                                .attr('width', function (m) {
                                    return scaleFn(+m.END.textContent) - scaleFn(+m.START.textContent);
                                })
                                .attr('x', function (m) {
                                    return scaleFn(m.START.textContent);
                                })
                                .attr('y', function (m) {
                                    return (m.TYPE.id === "band:stalk") ? (PADDING + STALK_SPACING) : PADDING;
                                });

                            var label = visTarget.append("text")
                                .attr("class", "band-lbl")
                                .attr("y", LABEL_PADDING);

                            band.on("mouseover", function (m) {
                                label.text(m.id)
                                    .attr('x', (scaleFn(m.START.textContent)));
                            });


                            band.on("click", function (m) {
                                var start = +m.START.textContent,
                                    end = +m.END.textContent,
                                    yshift = (PADDING - AXIS_SPACING);

                                if ((_options.selectionMode!=="none" && self.selectors.ary.length == 0) ||
                                    (_options.selectionMode === "multi" && _multiSelKeyPressed)) {
                                    self.selectors.ary.push(newSelector(scaleFn, start, end, yshift).draw());
                                }

                                if(_options.selectionMode === "single") {
                                    self.selectors.ary[0].move(start, end);
                                }

                                self.trigger("bandSelection", {
                                    segment: _options.segment,
                                    bandID: m.id,
                                    start: start,
                                    end: end
                                });
                            });

                            if (_options.includeAxis) {
                                var bpAxis = d3.svg.axis()
                                    .scale(scaleFn)
                                    .tickFormat(d3.format('s'))
                                    .orient("bottom");

                                visTarget.append('g')
                                    .attr('class', 'bp-axis')
                                    .attr('transform', 'translate(0,' + (_options.height + PADDING + AXIS_SPACING) + ")")
                                    .call(bpAxis);
                            }

                        } else {
                            //No html target set
                            console.log("cyto-Chromosome: invalid html target handle");
                        }

                        self.trigger('modelLoaded', {
                            id: model.id
                        });

                    });
                }
            });
            return self;
        };

        var _multiSelKeyPressed;
        (function () {
            console.log(_multiSelKeyPressed);

            d3.select("body")
                .on("keydown.brush", function() { _multiSelKeyPressed = d3.event.shiftKey;})
                .on("keyup.brush", function() { _multiSelKeyPressed = d3.event.shiftKey;});
        }());
    };

    return chr;
}());

require('biojs-events').mixin(Chromosome.prototype);
module.exports = Chromosome;
