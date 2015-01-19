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

        var options = (function () {

            return $.extend({}, {
                //DEFAULT OPTIONS
                dasSource : "http://www.ensembl.org/das/Homo_sapiens.GRCh38.karyotype",
                target: "#cyto-chr",
                width: 900,
                height: 20,
                relativeSize: false,
                includeAxis: false
            }, opt || {});
        }());

        var modelLoader = new ModelLoader({
            source: options.dasSource,
            segment: options.segment
        });

        this.info = function () {
            return options;
        };

        this.draw = function () {
            modelLoader.loadModel(function (model) {
                if (typeof model.err === 'undefined') {
                    $(function () {

                        console.log(model);

                        var rangeTo = options.relativeSize ? ((+model.stop / CHR1_BP_END) * options.width) - PADDING : options.width - PADDING;

                        var scaleFn = d3.scale.linear()
                            .domain([model.start, model.stop])
                            .range([0, rangeTo]);

                        var visTarget = d3.select(options.target)
                            .attr('width', options.width)
                            .attr('height', options.height + (2 * PADDING));

                        if (!visTarget.empty()) {

                            var band = visTarget.selectAll(options.target + " g")
                                .data(model.bands)
                                .enter().append("g");

                            //band.append("title")
                            //    .text(function(m) {return m.id; });

                            band.append('rect')
                                .attr('class', function (m) {
                                    return m.TYPE.id.replace(':', ' ');
                                })
                                .attr('height', function (m) {
                                    return (m.TYPE.id === "band:stalk") ? (options.height * STALK_MAG_PC) : options.height;
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
                                .attr("class", "label")
                                .attr("fill", "black")
                                .attr('font-size', 11)
                                .attr('font-family', 'sans-serif')
                                .attr("y", LABEL_PADDING);

                            band.on("mouseover", function (m) {
                                label.text(m.id)
                                    .attr('x', (scaleFn(m.START.textContent)));
                            });

                            band.on("click", function (m) {
                                console.log("click" + m.id);

                                self.trigger("onBandSelection", {
                                    start: +m.START.textContent,
                                    end: +m.END.textContent
                                });
                            });

                            if (options.includeAxis) {
                                var bpAxis = d3.svg.axis()
                                    .scale(scaleFn)
                                    .tickFormat(d3.format('s'))
                                    .orient("bottom");

                                visTarget.append('g')
                                    .attr('class', 'bp-axis')
                                    .attr('transform', 'translate(0,' + (options.height + PADDING + AXIS_SPACING) + ")")
                                    .call(bpAxis);
                            }

                        } else {
                            //No html target set
                            console.log("cyto-Chromosome: invalid html target handle");
                        }

                        self.trigger('onModelLoaded-intern', {
                            info: model.id
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
