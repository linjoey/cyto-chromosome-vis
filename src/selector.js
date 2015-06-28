
(function(cyto_chr, d3) {

  var Selector = function(extent) {
    if(extent){ this._extent = extent; }
    this._brush = d3.svg.brush();
    this.dispatch = d3.dispatch('change');
    this._x = 0;
    this._y = 0;
    this._extent = [0,0];
    this._height = 0;
    this._test = "default";
    this._another = "def";
  };

  function getSet(prop, arg, cb) {
    if(typeof arg !== 'undefined') {
      this[prop] =  arg;
      if(typeof cb === 'function') {
        cb();
      }
      return this;
    } else {
      return this[prop];
    }
  }

  Selector.prototype.test = function(e) {
    var self = this;
    return getSet.call(this, "_test", e, function(){
      self._another = "_that";
    });
  };

  Selector.prototype.extent = function (a) {

    var self = this;
    return getSet.call(this, "_extent", a, function(){
      self._brush.extent(a);
    });

  };

  Selector.prototype.xscale = function(a) {

    var self = this;
    return getSet.call(this, "_xscale", a, function(){
      self._brush.x(a)
    });
  };

  Selector.prototype.target = function(a) {
    return getSet.call(this, '_target', a);
  };

  Selector.prototype.height = function(a) {
    return getSet.call(this, '_height', a);
  };

  Selector.prototype.x = function(a) {
    return getSet.call(this, '_x', a);
  };

  Selector.prototype.y = function(a) {
    return getSet.call(this, '_y', a);
  };

  Selector.prototype.render = function() {

    var self = this;

    this.selector = this._target.append('g')
      .classed('selector', true)
      .attr('transform', 'translate(' + this._x + ',' + this._y + ')')
      .call(this._brush);

    this.selector.selectAll('rect')
      .attr('height', this._height);

    this.selector.select('.background').remove();

    var e = this.selector.select('.extent')
      .style('fill', 'steelblue')
      .style('opacity', '0.5');

    var cbg_xpos = this._xscale(this._extent[1]) + 5;
    var cbg_ypos = cyto_chr.margin.top - 3;

    var cbg = this._target.append('g');
    cbg.append('title').text('remove');

    this.deleteButton = cbg.append('circle')
      .attr('cx', cbg_xpos)
      .attr('cy', cbg_ypos)
      .attr('r', 5)
      .attr('fill', 'red')
      //.style('opacity', '0')
      .on('mouseover', function() {
        d3.select(this)
          .style('cursor', 'pointer')
          //.style('opacity', '1');
      })
      .on('mouseout', function(){
        d3.select(this)
          .style('cursor', 'default')
          //.style('opacity', '0');
      })
      .on('click', function() {

        self.remove();
      });

    this._brush.on('brush', function(d) {
      var e = self._brush.extent();
      var new_xpos = self._xscale(e[1]) + 5;
      self.deleteButton.attr('cx', new_xpos);
      self.dispatch.change(e);
    });

    this._brush.on('brushend', function(d){
      //console.log('cld');
    });

    return this;
  };

  Selector.prototype.remove = function() {
    this.selector.remove();
    this.deleteButton.remove();
    return this;
  };

  cyto_chr.selector = function(){
    return new Selector();
  };

})(window.cyto_chr = window.cyto_chr || {}, d3);