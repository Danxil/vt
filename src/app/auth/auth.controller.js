(function() {
  'use strict';

  angular.module('app.auth')
      .controller('AuthCtrl', AuthCtrl);

  AuthCtrl.$inject = ['auth', '$rootScope', '$state'];

  function AuthCtrl(auth, $rootScope, $state) {
    var vm = this;

    vm.credentials = {
      login: null,
      password: null
    }
    vm.message = "";

    vm.login = login;

    function login() {
      auth.login(vm.credentials)
          .then(function() {
            $state.go('app.projects');
          }, function(err) {
            vm.message = err.data.error_reason;
          });
    }

  };

})();