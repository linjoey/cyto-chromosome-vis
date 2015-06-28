
(function(cyto_chr, d3) {

  cyto_chr.margin = {
    top: 40,
    left: 5
  };

  cyto_chr.chrCount = 0;

  var CHR_HEIGHT = 15;
  var CHR1_BP_END = 248956422;
  var CHR1_BP_MID = 121700000;

  var Chromosome = function(opt) {
    //TODO FIX ALIGN AXIS AS WELL WHEN CENTERING CENTROMERE

    this._segment = "1";
    this._domTarget = d3.select(document.documentElement);
    this._resolution = "550";
    this._width = 1000;
    this._useRelative = false;
    this._showAxis = false;
    this.dispatch = d3.dispatch('bandclick', 'selectorchange');
    this.rendered = false;
  };

  Chromosome.prototype.segment = function (a) {
    return cyto_chr.InitGetterSetter.call(this, '_segment', a);
  };

  Chromosome.prototype.target = function (a) {
    if(typeof a === 'string') a = d3.select(a);
    if(a.empty()) {
      throw "Error: Invalid dom target";
    }
    return cyto_chr.InitGetterSetter.call(this, '_domTarget', a);
  };

  Chromosome.prototype.resolution = function (a) {
    return cyto_chr.InitGetterSetter.call(this, '_resolution', a);
  };

  Chromosome.prototype.width = function (a) {
    return cyto_chr.InitGetterSetter.call(this, '_width', a);
  };

  Chromosome.prototype.useRelative = function (a) {
    return cyto_chr.InitGetterSetter.call(this, '_useRelative', a);
  };

  Chromosome.prototype.showAxis = function (a) {
    return cyto_chr.InitGetterSetter.call(this, '_showAxis', a);
  };

  Chromosome.prototype.on = function(e, listener) {
    if (!this.dispatch.hasOwnProperty(e)) throw "Error: No event for " + e;

    this.dispatch.on(e, listener);
  };


  Chromosome.prototype.renderAxis = function () {
    var bpAxis = d3.svg.axis()
      .scale(this.xscale)
      .tickFormat(d3.format('s'))
      .orient("bottom");

    if (this._useRelative && (this.segment === "Y" || this.segment === "22" || this.segment === "21" || this.segment === "20" || this.segment === "19")) {
      bpAxis.ticks(6);
    }

    var axisg = this.svgTarget.append('g')
      .classed('bp-axis', true)
      .attr('transform', 'translate('+ cyto_chr.margin.left + ',' + (CHR_HEIGHT + cyto_chr.margin.top + 5) + ")");

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

    cyto_chr.chrCount++;

    if(self.rendered) {
      cyto_chr.chrCount--;
      self.svgTarget.remove();
    }

    cyto_chr.modelLoader.load(this._segment, this._resolution, function(data) {

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

      var rangeTo = self._useRelative ? (maxBasePair / CHR1_BP_END) * self._width : self._width;

      self.xscale = d3.scale.linear()
        .domain([1, maxBasePair])
        .range([0, rangeTo - cyto_chr.margin.left]);

      var svgWidth = self.alignCentromere ? self._width + (self._width * 0.3) : self._width;

      self.svgTarget = self._domTarget.append('svg')
        .attr('width', svgWidth)
        .attr('height', self.height);

      var bands = self.svgTarget.selectAll('g')
        .data(data).enter();

      if(cyto_chr.chrCount === 1) {
        cyto_chr.initPattern.call(self.svgTarget);
      }

      function bpCoord(bp) {
        var xshift = 0;
        if(self.alignCentromere && self._segment !== "1") {
          xshift = self.xscale(CHR1_BP_MID) - self.xscale(self.segMid);
        }

        return self.xscale(bp) + cyto_chr.margin.left + xshift;
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
              .attr("d", cyto_chr.roundedRect(bpCoord(d.bp_start), cyto_chr.margin.top, bpCoord(d.bp_stop) - bpCoord(d.bp_start), CHR_HEIGHT, r, tl, tr, bl, br))
              .style('fill', cyto_chr.getStainColour(d.stain, d.density));
          }

          if(i % 2 === 0) {
            var bmid = (bpCoord(d.bp_stop) + bpCoord(d.bp_start)) / 2;
            elem.append('line')
              .attr('x1', bmid)
              .attr('y1', cyto_chr.margin.top)
              .attr('x2', bmid)
              .attr('y2', cyto_chr.margin.top - 4)
              .style('stroke', 'grey')
              .style('stroke-width',1);

            elem.append('text')
              .attr('transform', 'translate(' + bmid + ',' + (cyto_chr.margin.top - 6) + ')rotate(-50)')
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

            var ys = d.stain === "stalk" ? cyto_chr.margin.top + (CHR_HEIGHT / 4) : cyto_chr.margin.top;
            var hs = d.stain === "stalk" ? CHR_HEIGHT / 2 : CHR_HEIGHT;
            rect = elem.append('rect')
              .attr('x', bpCoord(d.bp_start))
              .attr('y', ys)
              .attr('height', hs)
              .attr('width', self.xscale(d.bp_stop) - self.xscale(d.bp_start))
              .style('fill', cyto_chr.getStainColour(d.stain, d.density));
            applyBorder.call(rect);
          }

          rect.append('title')
            .text(d.arm + d.band)

          rect.on('mouseover', function(d) {
            var e = d3.select(this)
              .style('opacity', "0.5")
              .style('cursor', 'pointer');

            if (d.stain === "gneg") {
              e.style('fill', cyto_chr.getStainColour("gpos", "25"));
            }

          });

          rect.on('mouseout', function(d) {
            var e = d3.select(this)
              .style('opacity', "1")
              .style('cursor', 'default');

            if (d.stain === "gneg") {
              e.style('fill', cyto_chr.getStainColour("gneg"));
            }
          });

          rect.on('click', function(d) {

            var ve = cyto_chr.selector()
              .x(cyto_chr.margin.left)
              .y(cyto_chr.margin.top - (CHR_HEIGHT / 4))
              .height(CHR_HEIGHT + (CHR_HEIGHT / 2))
              .xscale(self.xscale)
              .extent([d.bp_start, d.bp_stop])
              .target(self.svgTarget)
              .render();

            ve.dispatch.on('change', function(d) {
              self.dispatch.selectorchange(d);
            });

            self.dispatch.bandclick(d);
          });
        });

      if (self._showAxis) {
        self.renderAxis();
      }

      self.rendered = true;

    });

    return self;
  };

  cyto_chr.chromosome = function(opt) {
    return new Chromosome(opt);
  };

})(window.cyto_chr = window.cyto_chr || {}, d3);