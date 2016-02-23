(function () {
    'use strict';

    angular
      .module('app.directives')
      .directive('cellContentSize', cellContentSize);

      cellContentSize.$inject = ['$rootScope', '$timeout', '$tooltip'];

      function cellContentSize($rootScope, $timeout, $tooltip) {

        var directive = {
          restrict: 'A',
          link: linkFunction
        }

        return directive;

        function linkFunction (scope, element, attr) {

          function checkElementSize() {
            if(element.width() > element.parent('td').width()){
              tooltip.setEnabled(true);
            } else {
              tooltip.setEnabled(false);           
            }
          }

          var tooltip = $tooltip(element, {
            title: attr.title || '',
            trigger: attr.trigger || 'hover',
            type: attr.type || 'info',
            container: attr.container || 'body'
          });

          tooltip.setEnabled(false);

          $timeout(checkElementSize, 0);

          $rootScope.$on('colsSettingsChanged', function () {
            $timeout(checkElementSize, 0);
          });
        }
      }
})();