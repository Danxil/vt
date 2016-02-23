(function () {
  'use strict';

  angular
    .module('app.directives')
    .directive('visTimeline', function () {
      'use strict';
      return {
        restrict: 'EA',
        scope: {
          data: '=',
          options: '=',
        },
        link: function (scope, element, attr) {
          // Declare the timeline
          var timeline = null;

          scope.$watch('data', function () {
            // Sanity check
            if (scope.data == null) return;

            if (timeline != null)
              timeline.setItems(scope.data)
            else
              timeline = new vis.Timeline(element[0], scope.data, scope.options);
          });

          scope.$watchCollection('options', function (options) {
            if (timeline == null) return;
            if (!options) options = {}

            timeline.setOptions(options);
          });
        }
      };
    })
})();

