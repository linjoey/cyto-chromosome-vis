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

        scope.chr = cyto_chr.chromosome()
          .target(d3.select(element[0]).select('.chromosome'))
          .width(scope.width)
          .segment(scope.segment)
          .resolution(scope.resolution)
          .useRelative(scope.useRelative == "true")
          .showAxis(scope.axis == "true")
          .render();

      }

      function controller($scope) {
        this.getActiveSelection = function() {}
        this.getActiveSelector = function() {}
        this.getAttrs = function() {

        }
      }

      return {
        link: link,
        restrict: 'E',
        controller: controller,
        transclude: true,
        template: '<div class="chromosome"></div><div ng-transclude></div>',
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