(function() {
  'use strict';

  angular
      .module('app.directives')
      .directive('mtTypeahead', mtTypeahead)

  mtTypeahead.$inject = [
    '$compile'
  ];

  function mtTypeahead($compile) {
    ctrlFunc.$inject = [
      '$scope'
    ];

    var directive = {
      require: 'ngModel',
      restrict: 'A',
      scope: true,
      link: linkFunc,
      controller: ctrlFunc
    };

    return directive;

    function ctrlFunc($scope) {

    }

    function linkFunc(scope, elem, attrs, ngModelCtrl) {
      scope.comparator = comparator.bind(null, attrs.minLength);

      var prevValue

      elem.attr('bs-typeahead', attrs.mtTypeahead)
      elem.removeAttr('mt-typeahead')

      elem.attr('bs-options', elem.attr('mt-options'))
      elem.removeAttr('mt-options')

      elem.attr('comparator', 'comparator')

      scope.$on('$typeahead.select', function(e, value, $typeahead) {
        var tquery = _extractor(prevValue);

        prevValue = _removeSearchText(prevValue, tquery)

        ngModelCtrl.$setViewValue(prevValue + value);
      })

      scope.$watch(function() {
        return ngModelCtrl.$modelValue
      }, function(newVal, oldVal) {
        prevValue = oldVal
      })

      $compile(elem)(scope)

      elem.off('mousedown')
    }

    function _extractor(query) {
      var result = /([^-^+]+)$/.exec(query);

      if (result && result[1])
        return result[1].trim();
      else
        return '';
    }

    function _removeSearchText(string, query) {
      var rString =  string.split('').reverse().join('');
      var rQuery =  query.split('').reverse().join('');

      return rString.replace(rQuery, '').split('').reverse().join('');
    }

    function comparator(threshold, item, value) {
      var tquery = _extractor(value);
      if (!tquery || tquery.trim().length < threshold) return false;
      return ~item.toLowerCase().indexOf(tquery.toLowerCase())
    }
  }
})();