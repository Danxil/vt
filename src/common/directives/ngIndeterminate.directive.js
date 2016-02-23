(function () {
  'use strict';

  angular
    .module('app.directives')
    .directive('ngIndeterminate', [function () {
      return {
        restrict: 'A',
        link: function(scope, element, attributes) {
          attributes.$observe('ngIndeterminate', function(value) {
            $(element).prop('indeterminate', value == "true");
          });
        }
      };
    }]);
})();