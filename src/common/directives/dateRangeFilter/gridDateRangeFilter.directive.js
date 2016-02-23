(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('gridDateRangeFilter', gridRangeFilter);

    function gridRangeFilter() {
        controllerFunc.$inject = ['$scope', '$attrs'];

        var directive =  {
            restrict: 'E',
            templateUrl: 'common/directives/dateRangeFilter/gridDateRangeFilter.html',
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

        function controllerFunc($scope, $attrs) {
            / jshint validthis:true /
            var vm = this;

            vm.disabled = true;

            vm.to = undefined;
            vm.applyRange = applyRange;
            vm.clearRange = clearRange;

            function applyRange() {
                $scope.params.filter()[$scope.filterName] = {
                    from: moment(vm.from).format('YYYY-MM-DD[T]HH:mm:ssZZ'),
                    to: moment(vm.to).format('YYYY-MM-DD[T]HH:mm:ssZZ')
                };
            }

            function clearRange() {
                vm.from = vm.to = undefined;
                delete $scope.params.filter()[$scope.filterName];
            }

            $scope.$watchCollection('vm', function (newVm, oldVm) {
                if(newVm.disabled === oldVm.disabled && newVm.from && newVm.to){
                    var from = newVm.from,
                        to = newVm.to;
                    var date = new Date(to) - new Date(from);
                    if(!isNaN(date)){
                        if(date < 0 && !newVm.disabled){
                            toastr.error('Please enter correct date period!')
                        }
                        vm.disabled = date < 0;
                    }
                }
            });
        }
    }
})();