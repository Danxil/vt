(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('gridRangeFilter', gridRangeFilter);

    function gridRangeFilter() {
        controllerFunc.$inject = ['$scope'];

        var directive =  {
            restrict: 'E',
            templateUrl: 'common/directives/rangeFilter/gridRangeFilter.html',
            scope: true,
            link: linkFunc,
            controller: controllerFunc,
            controllerAs: 'vm'
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            attr.$observe ('filterName', function (val) {
                scope.filterName = val;
            });

            attr.$observe ('filterLabel', function (val) {
                scope.filterLabel = val;
            });
        }

        function controllerFunc($scope) {
            /* jshint validthis:true */
            var vm = this;

            vm.from = undefined;
            vm.to = undefined;
            vm.applyRange = applyRange;
            vm.clearRange = clearRange;

            function applyRange() {
                $scope.params.filter()[$scope.filterName] = {from: vm.from, to:vm.to};
            }

            function clearRange() {
                vm.from = vm.to = undefined;
                delete $scope.params.filter()[$scope.filterName];
            }
        }
    }
})();