(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('loader', ['$rootScope', function ($rootScope) {
            return function ($scope, element, attrs) {
                $rootScope.$on("loader_show", function () {
                    element.show().attr('loader-state', 'on');
                });
                $rootScope.$on("loader_hide", function () {
                    element.hide().attr('loader-state', 'off')
                });
            };
        }])
})();