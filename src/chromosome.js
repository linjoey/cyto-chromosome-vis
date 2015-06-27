
(function(chr_map, d3) {

  //http://stackoverflow.com/questions/12115691/svg-d3-js-rounded-corner-on-one-corner-of-a-rectangle
  function rounded_rect(x, y, w, h, r, tl, tr, bl, br) {
    var retval;
    retval = "M" + (x + r) + "," + y;
    retval += "h" + (w - 2 * r);
    if (tr) {
      retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r;
    }
    else {
      retval += "h" + r;
      retval += "v" + r;
    }
    retval += "v" + (h - 2 * r);
    if (br) {
      retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r;
    }
    else {
      retval += "v" + r;
      retval += "h" + -r;
    }
    retval += "h" + (2 * r - w);
    if (bl) {
      retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r;
    }
    else {
      retval += "h" + -r;
      retval += "v" + -r;
    }
    retval += "v" + (2 * r - h);
    if (tl) {
      retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r;
    }
    else {
      retval += "v" + -r;
      retval += "h" + r;
    }
    retval += "z";
    return retval;
  }

  function getStainColour(bandtype, density) {

    if(bandtype == "gpos") {
      if(density === "" || density === null) return "#000000";

      switch(density) {
        case "100":
          return "#000000";
        case "75":
          return "#666666";
        case "50":
          return "#999999";
        case "25":
          return "#d9d9d9";
      }
    }

    if (bandtype === "gneg") {
      return "#ffffff";
    }

    if (bandtype === "acen") {
      return "url(#acen-fill)";
      //return "#708090";
    }

    if (bandtype === "gvar") {
      return "#e0e0e0";
    }

    if(bandtype === "stalk") {
      return "#708090";
    }

    return "green";
  }

  var margin = {
    top: 10,
    left: 5
  };

  var CHR_HEIGHT = 17;
  var CHR1_BP_END = 248956422;

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
    this.resolution = opt.resolution || "850";
    this.width = opt.width || 1000;
    this.height = opt.height || 50;

    this.useRelative = opt.relativeSize || true;
    this.showAxis = opt.showAxis || true;
  };

  Chromosome.prototype.renderAxis = function () {
    var bpAxis = d3.svg.axis()
      .scale(this.xscale)
      .tickFormat(d3.format('s'))
      .orient("bottom");

    if (
      this.segment === "Y" ||
      this.segment === "22" ||
      this.segment === "21" ||
      this.segment === "20" ||
      this.segment === "19"
    ) {
      console.log(this.segment)
      bpAxis.ticks(6);
    }

    var axisg = this.svgTarget.append('g')
      .classed('bp-axis', true)
      .attr('transform', 'translate('+ margin.left+',' + (CHR_HEIGHT + margin.top + 5) + ")");

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

      var rangeTo = self.useRelative ? (maxBasePair / CHR1_BP_END) * self.width : self.width;

      self.xscale = d3.scale.linear()
        .domain([1, maxBasePair])
        .range([0, rangeTo - margin.left]);

      self.svgTarget = self.domTarget.append('svg')
        .attr('width', self.width)
        .attr('height', self.height);

      var bands = self.svgTarget.selectAll('g')
        .data(data).enter();

      function bpCoord(bp) {
        return self.xscale(bp) + margin.left;
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
              .attr("d", rounded_rect(bpCoord(d.bp_start), margin.top, bpCoord(d.bp_stop) - bpCoord(d.bp_start), CHR_HEIGHT, r, tl, tr, bl, br))
              .style('fill', getStainColour(d.stain, d.density));
          }

          var rect;
          var w = bpCoord(d.bp_stop) - bpCoord(d.bp_start);
          if (i === 0 && w > 10) {
            rect = drawRoundedRect.call(elem, d, 4, true, false, true, false);
            applyBorder.call(rect);
          } else if (d.stain === "acen" && (w > 10)) {

            if (d.arm === "p") {
              rect = drawRoundedRect.call(elem, d, 10, false, true, false, true);

            } else if(d.arm === "q") {
              rect = drawRoundedRect.call(elem, d, 10, true, false, true, false);
            }
          } else if (i === data.length - 1) {

            rect = drawRoundedRect.call(elem, d, 5, false, true, false, true);
            applyBorder.call(rect);

          } else {
            rect = elem.append('rect')
              .attr('x', bpCoord(d.bp_start))
              .attr('y', margin.top)
              .attr('height', CHR_HEIGHT)
              .attr('width', self.xscale(d.bp_stop) - self.xscale(d.bp_start))
              .style('fill', getStainColour(d.stain, d.density));
            applyBorder.call(rect);
          }

          rect.on('mouseover', function(d) {
            var e = d3.select(this)
              .style('opacity', "0.5")
              .style('cursor', 'pointer');

            if (d.stain === "gneg") {
              e.style('fill', getStainColour("gpos", "25"));
            }

          });

          rect.on('mouseout', function(d) {
            var e = d3.select(this)
              .style('opacity', "1")
              .style('cursor', 'default');

            if (d.stain === "gneg") {
              e.style('fill', getStainColour("gneg"));
            }
          });
        });

      if (self.showAxis !== "false") {
        self.renderAxis();
      }

    });

    return self;
  };

  chr_map.Chromosome = Chromosome;

})(window.chr_map = window.chr_map || {}, d3);