(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('gridDateTimeRangeFilter', gridRangeFilter);

    function gridRangeFilter() {
        controllerFunc.$inject = ['$scope', '$attrs', '$element'];

        var directive =  {
            restrict: 'E',
            templateUrl: 'common/directives/dateTimeRangeFilter/gridDateTimeRangeFilter.html',
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

        function controllerFunc($scope, attrs, el) {
            / jshint validthis:true /
            var vm = this;

            vm.disabled = true;

            vm.from = $scope.params.filter()[attrs.filterName] ?
                $scope.params.filter()[attrs.filterName].from :
                null

            vm.to = $scope.params.filter()[attrs.filterName] ?
                $scope.params.filter()[attrs.filterName].to :
                null

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
                if(newVm.disabled === oldVm.disabled){
                    var date = new Date(newVm.to) - new Date(newVm.from);
                    if(!isNaN(date)){
                        if(date < 0 && !newVm.disabled){
                            toastr.error('Please enter correct date-time period!')
                        }
                        vm.disabled = date < 0;
                    }
                }
            });
        }
    }
})();