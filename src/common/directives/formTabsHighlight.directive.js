(function() {
  'use strict';

  angular
      .module('app.directives')
      .directive('formTabsHighlight', formTabsHighlight)

  formTabsHighlight.$inject = [];

  function formTabsHighlight() {
    var directive = {
      require: 'form',
      restrict: 'A',
      scope: true,
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, elem, attrs, ngFormCtrl) {

      scope.$watchGroup([
            function() {
              return ngFormCtrl.$submitted;
            },
            function() {
              var length = 0

              _.each(ngFormCtrl.$error, function(error) {
                length += error.length
              });

              return length
            },
            function() {
              var length = 0

              _.each(ngFormCtrl.$error, function(error) {
                _.each(error, function(field) {
                  length += field.$untouched
                })
              });

              return length
            },
          ],
          function(newVal) {
            //delay
            setTimeout(function() {
              var selector = ngFormCtrl.$submitted ? '.ng-invalid' : '.ng-touched.ng-invalid'

              _.each(elem.find('.tab-pane'), function(tab) {
                tab = $(tab);
                var tabToggler = $('[href="#' + tab.attr('id') + '"]')

                if (tab.find(selector).length)
                  tabToggler.addClass('error')
                else
                  tabToggler.removeClass('error')
              })
            }, 500)
          }
      );
    }
  }
})();