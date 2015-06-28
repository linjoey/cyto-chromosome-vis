
(function(cyto_chr, d3) {

  var Selector = function(extent) {
    if(extent){ this.extent = extent; }
    this.brush = d3.svg.brush();
    this.dispatch = d3.dispatch('change');
  };

  //TODO make get work after setting as a function
  function getSet(prop, arg) {
    if(typeof arg !== 'undefined') {
      this[prop] =  arg;
      return this;
    } else {
      return this[prop];
    }
  }

  Selector.prototype.extent = function (e) {
    getSet.call(this, "extent", e);

    this.brush.extent(e);

    return this;
  };

  Selector.prototype.xscale = function(s) {

    getSet.call(this, "xscale", s);

    this.brush.x(this.xscale);
    return this;
  };

  Selector.prototype.target = function(a) {
    return getSet.call(this, 'target', a);
  };

  Selector.prototype.height = function(a) {
    return getSet.call(this, 'height', a);
  };

  Selector.prototype.x = function(a) {
    return getSet.call(this, 'x', a);
  };

  Selector.prototype.y = function(a) {
    return getSet.call(this, 'y', a);
  };

  Selector.prototype.render = function() {

    var self = this;

    this.selector = this.target.append('g')
        .attr('transform', 'translate(' + this.x + ',' + this.y + ')')
        .call(this.brush);

    this.selector.selectAll('rect')
      .attr('height', this.height);

    this.selector.select('.background').remove();

    var e = this.selector.select('.extent')
      .style('fill', 'steelblue')
      .style('opacity', '0.5');

    var cbg = this.target.append('g');
    cbg.append('title').text('remove');

    this.deleteButton = cbg.append('circle')
      .attr('cx', this.xscale(this.extent[1]) + 5)
      .attr('cy', cyto_chr.margin.top - 5)
      .attr('r', 5)
      .attr('fill', 'red')
      .on('mouseover', function() {
        d3.select(this)
          .style('cursor', 'pointer')
          .style('opacity', '0.7');
      })
      .on('mouseout', function(){
        d3.select(this)
          .style('cursor', 'default')
          .style('opacity', '1');
      })
      .on('click', function() {

        self.remove();
      });

    this.brush.on('brush', function(d) {
      var e = self.brush.extent();
      self.deleteButton.attr('cx', self.xscale(e[1]) + 5);
      self.dispatch.change(e);
    });

    return this;
  };

  Selector.prototype.remove = function() {
    this.selector.remove();
    this.deleteButton.remove();
    return this;
  };

  cyto_chr.Selector = Selector;

})(window.cyto_chr = window.cyto_chr || {}, d3);