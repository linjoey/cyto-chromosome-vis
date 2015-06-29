(function(){
  if(typeof angular === 'undefined') {
    return;
  }

  angular.module('cyto-chromosome-vis',[])
    .directive('chromosome',[function() {
      function link(scope, element, attr) {

        attr.resolution = cyto_chr.setOption(attr.resolution, "550");
        attr.width = cyto_chr.setOption(attr.width, 1000);
        attr.segment = cyto_chr.setOption(attr.segment, "1");
        attr.useRelative = cyto_chr.setOption(attr.useRelative, true);
        attr.axis = cyto_chr.setOption(attr.axis, false);

        cyto_chr.chromosome()
          .target(d3.select(element[0]))
          .width(attr.width)
          .segment(attr.segment)
          .resolution(attr.resolution)
          .useRelative(attr.useRelative == "true")
          .showAxis(attr.axis == "true")
          .render();

      }

      return {
        link: link,
        restrict: 'E'
      }
    }])
    .factory('chromosomeFactory', [function() {
      return {
        build: function() {
          return cyto_chr.chromosome();
        }
      }
    }]);

})();