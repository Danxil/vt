(function () {
  'use strict';

  angular
    .module('app.directives')
    .directive('resolvePopover', resolvePopover);

  resolvePopover.$inject = ['$popover', '$q', '$parse']

  function resolvePopover($popover, $q, $parse) {
    var directive =  {
      restrict: 'A',
      scope: true,
      link: linkFunc,
    };

    return directive;

    function linkFunc(scope, elem, attr) {
      var resolvePopover = $parse(attr.resolvePopover)(scope)
      var beforeShow = function() {
        $parse(attr.beforeShow)(scope)
      }

      resolvePopover.trigger = 'manual'
      resolvePopover.scope = scope

      var popover = $popover(elem, resolvePopover)

      elem.on('click', function() {
        if (!popover.$isShown)
          $q.when(beforeShow()).then(function() {
            popover.show()
          })
        else
          popover.hide()
      })
    }
  }
})();