(function() {
  'use strict';

  angular.module('app.admins')
      .config(configFn);

  configFn.$inject = ['$stateProvider'];

  function configFn($stateProvider) {
    $stateProvider
        .state('app.admins', {
          url: 'admins',
          controller: 'AdminsCtrl',
          controllerAs: 'vm',
          templateUrl: 'app/admins/admins.tpl.html',
          requiredLogin: true,
          isSuperuser: true
        });
  };

})();