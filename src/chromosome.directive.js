(function(){
  if(typeof angular === 'undefined') {
    return;
  }

  angular.module('cyto-chromosome-vis',[])
    .directive('chromosome',[function() {
      function link(scope, element, attr) {

        scope.resolution = cyto_chr.setOption(scope.resolution, "550");
        scope.width = cyto_chr.setOption(scope.width, 1000);
        scope.segment = cyto_chr.setOption(scope.segment, "1");
        scope.useRelative = cyto_chr.setOption(scope.useRelative, true);
        scope.axis = cyto_chr.setOption(scope.axis, false);

        var chr = cyto_chr.chromosome()
          .target(d3.select(element[0]))
          .width(scope.width)
          .segment(scope.segment)
          .resolution(scope.resolution)
          .useRelative(scope.useRelative == "true")
          .showAxis(scope.axis == "true")
          .render();

      }

      return {
        link: link,
        restrict: 'E',
        scope: {
          width: '@',
          segment: '@',
          resolution: '@',
          useRelative: '@',
          axis: '@'
        }
      }
    }]);
})();