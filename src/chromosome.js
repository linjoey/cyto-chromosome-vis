
(function(chr_map, d3) {

  var margin = {
    top: 40,
    left: 5
  };

  var CHR_HEIGHT = 17;
  var CHR1_BP_END = 248956422;
  var CHR1_BP_MID = 121700000;

  var Chromosome = function(opt) {

    if(typeof opt.target === "undefined") {
      throw "Error: Chromosome constructor undfefined DOM target";
    }

    if(typeof opt.segment === "undefined") {
      throw "Error: Chromosome segment is undfefined";
    }

    if(typeof opt.target === "string") {
      this.domTarget = d3.select(opt.target);
    } else {
      this.domTarget = opt.target;
    }

    this.segment = opt.segment.toString();
    this.resolution = chr_map.setOption(opt.resolution, "550");
    this.width = chr_map.setOption(opt.width, 1000);
    this.height = 90;
    this.useRelative = chr_map.setOption(opt.useRelative, true);
    this.showAxis = chr_map.setOption(opt.showAxis, true);
    //TODO FIX ALIGN AXIS AS WELL WHEN CENTERING CENTROMERE
    this.alignCentromere = chr_map.setOption(opt.alignCentromere, false);

  };

  Chromosome.prototype.renderAxis = function () {
    var bpAxis = d3.svg.axis()
      .scale(this.xscale)
      .tickFormat(d3.format('s'))
      .orient("bottom");

    if (
      this.useRelative && (
      this.segment === "Y" ||
      this.segment === "22" ||
      this.segment === "21" ||
      this.segment === "20" ||
      this.segment === "19")
    ) {
      bpAxis.ticks(6);
    }

    var axisg = this.svgTarget.append('g')
      .classed('bp-axis', true)
      .attr('transform', 'translate('+ margin.left + ',' + (CHR_HEIGHT + margin.top + 5) + ")");

      axisg.call(bpAxis);

    axisg.selectAll('text')
      .style('font', '10px sans-serif');

    axisg.selectAll('path, line')
      .style({
        "fill": "none",
        "stroke": "#666666",
        "shape-rendering": "crispEdges"
      });
  };

  Chromosome.prototype.render = function () {

    var self = this;

    chr_map.modelLoader.load(this.segment, this.resolution, function(data) {

      var maxBasePair = d3.max(data, function(d) {
        return +d.bp_stop;
      });

      self.segMid = 0;
      for(var j =0; j < data.length;j++) {
        if(data[j].stain ==="acen") {
          self.segMid = data[j].bp_stop;
          break;
        }
      }

      var rangeTo = self.useRelative ? (maxBasePair / CHR1_BP_END) * self.width : self.width;

      self.xscale = d3.scale.linear()
        .domain([1, maxBasePair])
        .range([0, rangeTo - margin.left]);

      var svgWidth = self.alignCentromere ? self.width + (self.width * 0.3) : self.width;

      self.svgTarget = self.domTarget.append('svg')
        .attr('width', svgWidth)
        .attr('height', self.height);

      var bands = self.svgTarget.selectAll('g')
        .data(data).enter();

      function bpCoord(bp) {
        var xshift = 0;
        if(self.alignCentromere && self.segment !== "1") {
          console.log(self.segMid)
          xshift = self.xscale(CHR1_BP_MID) - self.xscale(self.segMid);
        }

        return self.xscale(bp) + margin.left + xshift;
      }

      bands.append('g')
        .each(function(d, i) {

          var elem = d3.select(this);

          function applyBorder() {
            this
              .attr('stroke', '#000000')
              .attr('stroke-width', 0.2);
          }

          function drawRoundedRect(d, r, tl, tr, bl, br) {
            return this.append('path')
              .attr("d", chr_map.roundedRect(bpCoord(d.bp_start), margin.top, bpCoord(d.bp_stop) - bpCoord(d.bp_start), CHR_HEIGHT, r, tl, tr, bl, br))
              .style('fill', chr_map.getStainColour(d.stain, d.density));
          }

          if(i % 2 === 0) {
            var bmid = (bpCoord(d.bp_stop) + bpCoord(d.bp_start)) / 2;
            elem.append('line')
              .attr('x1', bmid)
              .attr('y1', margin.top)
              .attr('x2', bmid)
              .attr('y2', margin.top - 4)
              .style('stroke', 'grey')
              .style('stroke-width',1);

            elem.append('text')
              .attr('transform', 'translate(' + bmid + ',' + (margin.top - 6) + ')rotate(-50)')
              .style('font', '10px sans-serif')
              .text(d.arm + d.band);
          }

          var rect;
          var w = bpCoord(d.bp_stop) - bpCoord(d.bp_start);
          if (i === 0 && w > 10) {
            rect = drawRoundedRect.call(elem, d, 4, true, false, true, false);
            applyBorder.call(rect);
          } else if (d.stain === "acen" && (w > 6)) {

            if (d.arm === "p") {
              rect = drawRoundedRect.call(elem, d, 8, false, true, false, true);

            } else if(d.arm === "q") {
              rect = drawRoundedRect.call(elem, d, 8, true, false, true, false);
            }
          } else if (i === data.length - 1) {

            rect = drawRoundedRect.call(elem, d, 5, false, true, false, true);
            applyBorder.call(rect);

          } else {

            var ys = d.stain === "stalk" ? margin.top + (CHR_HEIGHT / 4) : margin.top;
            var hs = d.stain === "stalk" ? CHR_HEIGHT / 2 : CHR_HEIGHT;
            rect = elem.append('rect')
              .attr('x', bpCoord(d.bp_start))
              .attr('y', ys)
              .attr('height', hs)
              .attr('width', self.xscale(d.bp_stop) - self.xscale(d.bp_start))
              .style('fill', chr_map.getStainColour(d.stain, d.density));
            applyBorder.call(rect);
          }

          rect.append('title')
            .text(d.arm + d.band)

          rect.on('mouseover', function(d) {
            var e = d3.select(this)
              .style('opacity', "0.5")
              .style('cursor', 'pointer');

            if (d.stain === "gneg") {
              e.style('fill', chr_map.getStainColour("gpos", "25"));
            }

          });

          rect.on('mouseout', function(d) {
            var e = d3.select(this)
              .style('opacity', "1")
              .style('cursor', 'default');

            if (d.stain === "gneg") {
              e.style('fill', chr_map.getStainColour("gneg"));
            }
          });
        });

      if (self.showAxis) {
        self.renderAxis();
      }

    });

    return self;
  };

  chr_map.Chromosome = Chromosome;

})(window.chr_map = window.chr_map || {}, d3);