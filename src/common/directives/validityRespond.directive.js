(function() {
  'use strict';

  angular
      .module('app.directives')
      .directive('validityRespond', validityRespond)

  function validityRespond() {
    controllerFunc.$inject = ['$scope', '$element', '$compile'];

    var directive = {
      require: 'ngModel',
      restrict: 'A',
      scope: true,
      controller: controllerFunc,
      link: linkFunc
    };

    return directive;

    function controllerFunc($scope, $element, $compile) {
      var tpl = [
        '<ul class="list-unstyled text-danger mt-5" role="alert" ng-show="invalid && showError">',
        '<li ng-repeat="(key, value) in errors" ng-show="value">',
        '<p ng-if="customErrors[key]">{{customErrors[key]}}</p>',
        '<p ng-if="!customErrors[key]">{{ key }}</p>',
        '</li>',
        '</ul>',
      ].join('');
      $element.parent().append($compile(tpl)($scope));
    }

    function linkFunc(scope, element, attrs, ngModelCtrl) {
      var formCtrl = ngModelCtrl.$$parentForm;
      var validatedObj = {};

      scope.invalid = false;
      scope.errors = ngModelCtrl.$error;

      if (attrs.customErrors) {
        scope.customErrors = scope.$eval(attrs.customErrors);
      }
      if (attrs.validatedObj) {
        var validObj = scope.$eval(attrs.validatedObj);
        validatedObj = angular.isObject(validObj) ? validObj : {};
      }
      scope.$watchGroup([
            function() {
              return ngModelCtrl.$invalid;
            },
            function() {
              return ngModelCtrl.$untouched;
            },
            function() {
              return formCtrl.$submitted;
            },
          ],
          function(newVal) {
            scope.showError = formCtrl.$submitted || !ngModelCtrl.$untouched || scope.$eval(attrs.validityAtOnce)
            scope.invalid = validatedObj.invalid = ngModelCtrl.$invalid;
          }
      );
    }
  }
})();