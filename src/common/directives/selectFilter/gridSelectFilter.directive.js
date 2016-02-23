(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('gridSelectFilter', gridSelectFilter);

    function gridSelectFilter() {
        var directive =  {
            restrict: 'E',
            templateUrl: 'common/directives/selectFilter/gridSelectFilter.html',
            scope: true,
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            attr.$observe ('filterOptions', function (val) {
                scope.filterOptions = scope.$eval(val);
            });

            attr.$observe ('filterName', function (val) {
                scope.filterName = val;
            });
        }
    }
})();