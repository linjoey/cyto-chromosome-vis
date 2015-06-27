
(function(chr_map, d3) {

  var Selector = function(extent) {
    if(extent){ this.extent = extent; }
    this.brush = d3.svg.brush();
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

    this.selector = this.target.append('g')
        .attr('transform', 'translate(' + this.x + ',' + this.y + ')')
        .call(this.brush);

    this.selector.selectAll('rect')
      .attr('height', this.height);

    this.selector.select('.background').remove();

    this.selector.select('.extent')
      .style('fill', 'steelblue')
      .style('opacity', '0.5');

    return this;
  };

  Selector.prototype.remove = function() {
    this.selector.remove();
    return this;
  };

  chr_map.Selector = Selector;

})(window.chr_map = window.chr_map || {}, d3);