(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('colSettings', colSettings);

    colSettings.$inject = ['$rootScope', '_', 'localStorageService', 'toastr'];

    function colSettings($rootScope, _, localStorageService, toastr) {

        var directive =  {
            restrict: 'A',
            scope: {
                cols: '=colSettings',
                key: '@settingsStorageKey'
            },
            template: templateFn,
            link: linkFn,
        };

        return directive;

        function templateFn(el) {
            var tpl = [
                '<span class="fa fa-gear cols-settings-button"',
                    ' title="Columns settings"',
                    ' bs-popover',
                    ' data-auto-close="true',
                    ' data-trigger="click"',
                    ' data-placement="bottom"',
                    ' data-template="common/directives/columnSettings/tooltip.html">',
                '</span>'
            ];
            return tpl.join('');
        }

        function linkFn(scope, el, attr) {
            var initial = angular.copy(scope.cols);

            scope.sortOptions = {
                animation: 100,
                ghostClass: "ghost"
            }
            scope.colSettings = init();

            function init(){
                if(_.indexOf(localStorageService.keys(), scope.key) != -1) {
                    return localStorageService.get(scope.key);
                } else {
                    return _.map(scope.cols, function(name){
                        return {name: name, visible: true};
                    });
                }
            }

            scope.$watch('colSettings', function(new_val){
                scope.cols = _.chain(new_val).filter('visible', true).pluck('name').value();
                $rootScope.$broadcast('colsSettingsChanged');
            }, true)

            scope.save = function() {
                localStorageService.set(scope.key, scope.colSettings);
                toastr.success('Changes were saved');
            }

            scope.setDefault = function() {
                localStorageService.remove(scope.key);
                scope.cols = initial;
                scope.colSettings = init();
            }
        }
        
    }
})();