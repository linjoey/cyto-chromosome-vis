/**
 * INTERACTIVE CHROMOSOME VISUALIZATION
 * opt : initialization options object
 *  + target: REQUIRED
 *  + segment: REQUIRED
 *
 *
 */

var d3 = require("d3");
//var $ = require("jquery");
var ModelLoader = require("./model-loader");
var Selector = require("./selector.js");
var assign = require('lodash.assign');

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
            return assign({}, {
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

        var _model, _xscale;

        this.selectors = {
            selectorList: new Array(),
            deleteAll: function () {
                for (var i = 0; i < this.selectorList.length; i++) {
                    this.selectorList[i].delete();
                }
                this.selectorList.length = 0;
            },
            getSelections: function () {
                var list = new Array();
                for (var i = 0; i < this.selectorList.length; i++)
                {
                    list.push(this.selectorList[i].getSelectedCoords());
                }
                return list;
            }
        };

        this.info = function () {
            return _options;
        };

        this.getCoordsByBand = function (band) {
            var ret = [];
            if (typeof _model !== 'undefined') {
                for (var i = 0; i < _model.bands.length; i++) {
                    if (band == _model.bands[i].id) {
                        ret = [+_model.bands[i].START.textContent, +_model.bands[i].END.textContent];
                        break;
                    }
                }

            }
            return ret;
        };

        this.moveSelectorTo = function (to, from) {
            if (_options.selectionMode!=="none") {
                self.selectors.selectorList[0].move(to, from);
            }
        };

        this.getCurrentSelections = function () {
            return self.selectors.getSelections();
        };

        this.deleteSelectors = function () {
            self.selectors.deleteAll();
        }

        function newSelector(xscale, start, end, yshift) {
            return new Selector({
                xscale: xscale,
                y: yshift,
                target: _options.target
            }).init(start, end)
                .on("selectionChanged", function (e) {
                    e.segment = _options.segment;
                    self.trigger("selectionChanged", e);
            });
        };

        this.addSelector = function (start, end, yshift) {
            self.selectors.selectorList.push(newSelector(_xscale, start, end, yshift).draw());
        }

        this.draw = function () {
            _modelLoader.loadModel(function (model) {
                //console.log(model);
                _model = model;
                if (typeof model.err === 'undefined') {
                    $(function () {
                        var rangeTo = _options.relativeSize
                            ? ((+model.stop / CHR1_BP_END) * _options.width) - PADDING
                            : _options.width - PADDING;

                        _xscale = d3.scale.linear()
                            .domain([model.start, model.stop])
                            .range([0, rangeTo]);

                        var visTarget = d3.select(_options.target)
                            .attr('width', _options.width)
                            .attr('height', _options.height + (2 * PADDING));

                        if (!visTarget.empty()) {

                            var band = visTarget.selectAll(_options.target + " g")
                                .data(model.bands)
                                .enter().append("g");

                            var centromereLocation;
                            band.append('rect')
                                .attr('class', function (m) {
                                    if(m.TYPE.id === "band:acen" && (m.id.indexOf('p')==0)) {
                                        centromereLocation = m.END.textContent;
                                    }
                                    return m.TYPE.id.replace(':', ' ');
                                })
                                .attr('height', function (m) {
                                    return (m.TYPE.id === "band:stalk") ? (_options.height * STALK_MAG_PC) : _options.height;
                                })
                                .attr('width', function (m) {
                                    return _xscale(+m.END.textContent) - _xscale(+m.START.textContent);
                                })
                                .attr('x', function (m) {
                                    return _xscale(m.START.textContent);
                                })
                                .attr('y', function (m) {
                                    return (m.TYPE.id === "band:stalk") ? (PADDING + STALK_SPACING) : PADDING;
                                });
                            // Centromere line optio
                            //visTarget.append('line')
                            //    .style('stroke', 'red')
                            //    .style('stroke-width', 2)
                            //    .attr('x1', _xscale(centromereLocation))
                            //    .attr('y1', 0)
                            //    .attr('x2', _xscale(centromereLocation))
                            //    .attr('y2', _options.height);

                            //centromere dot option
                            visTarget.append('circle')
                                .classed('centromere', true)
                                .attr('cx', _xscale(centromereLocation))
                                .attr('cy', PADDING - 6)
                                .attr('r', 5);
                            var label = visTarget.append("text")
                                .attr("class", "band-lbl")
                                .attr("y", LABEL_PADDING);

                            band.on("mouseover", function (m) {
                                label.text(m.id)
                                    .attr('x', (_xscale(m.START.textContent)));
                            });

                            band.on("click", function (m) {
                                var start = +m.START.textContent,
                                    end = +m.END.textContent;

                                if ((_options.selectionMode!=="none" && self.selectors.selectorList.length == 0) ||
                                    (_options.selectionMode === "multi" && d3.event.shiftKey)) {
                                    self.addSelector(start,end, (PADDING - AXIS_SPACING))
                                }

                                if(_options.selectionMode === "single") {
                                    self.selectors.selectorList[0].move(start, end);
                                }

                                self.trigger("bandSelection", {
                                    segment: _options.segment,
                                    bandID: m.id,
                                    type: m.TYPE.textContent,
                                    start: start,
                                    end: end
                                });
                            });

                            if (_options.includeAxis) {
                                var bpAxis = d3.svg.axis()
                                    .scale(_xscale)
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
    };

    return chr;
}());

require('biojs-events').mixin(Chromosome.prototype);
module.exports = Chromosome;
