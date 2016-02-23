(function() {
  'use strict';

  angular.module('app.layout')
    .controller('LayoutCtrl', LayoutCtrl);

    LayoutCtrl.$inject = ['$rootScope', '$state', 'auth', '$window'];

    function LayoutCtrl($rootScope, $state, auth, $window) {
      var vm = this;

      vm.version = $window['VERSION'];
      vm.$state = $state;

      vm.user = null;
      vm.logout = logout;

      activate();

      function activate() {
      }

      function logout() {
        auth.logout();
      }
    }

})();