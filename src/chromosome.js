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

        var self = this;

        var options = (function () {

            return $.extend({}, {
                //DEFAULT OPTIONS
                dasSource : "http://www.ensembl.org/das/Homo_sapiens.GRCh38.karyotype",
                target: "#cyto-chr",
                width: 900,
                height: 20
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


                        var scaleFn = d3.scale.linear()
                            .domain([model.start, model.stop])
                            .range([0, options.width]);


                        var visTarget = d3.select(options.target)
                            .attr('width', options.width)
                            .attr('height', options.height);

                        if (!visTarget.empty()) {
                            //console.log("holder div present");


                            var band = visTarget.selectAll("g")
                                .data(model.bands)
                                .enter().append("g");

                            visTarget.append("rect")
                                .attr('class', "band border")
                                .attr('height', options.height)
                                .attr('width', options.width);

                            band.append('rect')
                                .attr('class', function (m) {
                                    return m.TYPE.id.replace(':', ' ');
                                })
                                .attr('height', function (m) {
                                    return (m.TYPE.id === "band:stalk") ? (options.height * .8) : options.height;
                                })
                                .attr('width', function (m) {
                                    return scaleFn(+m.END.textContent) - scaleFn(+m.START.textContent);
                                })
                                .attr('x', function (m) {
                                    return scaleFn(m.START.textContent);
                                });


                            var stalkBand = d3.select(".band.stalk")
                                .attr('dy',50);
                            var sX = stalkBand.attr('x');
                            var sWidth = stalkBand.attr('width');

                            //Border mask top
                            visTarget.append('line')
                                .attr('class', 'band stalkMask top')
                                .attr('x1', sX)
                                .attr('x2', (+sX + (+sWidth)));

                            //Border mask bottom
                            visTarget.append('line')
                                .attr('class', 'band stalkMask bot')
                                .attr('x1', sX)
                                .attr('x2', (+sX + (+sWidth)))
                                .attr('y1', options.height)
                                .attr('y2', options.height);


                        } else {
                            //No html target set
                            console.log("cyto-Chromosome: invalid html target handle");
                        }

                    });
                }
            });
        };

        //(function () {
        //    $(window).resize(function () {
        //        console.log(autoResize);
        //        if (autoResize) {
        //            options.width = $(options.target).width();
        //        }
        //    });
        //}());
    };

    return chr;
}());

require('biojs-events').mixin(Chromosome.prototype);
module.exports = Chromosome;
