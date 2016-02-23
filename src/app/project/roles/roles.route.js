(function() {
  'use strict';

  angular.module('app.project.roles')
    .config(configFn);

    configFn.$inject = ['$stateProvider'];

    function configFn($stateProvider) {
      $stateProvider
        .state('app.project.roles', {
          url: '/roles',
          controller: 'RolesCtrl',
          controllerAs: 'vm',
          templateUrl: 'app/project/roles/roles.tpl.html',
          requiredLogin: true,
          isSuperuser: true
        });
    };

})();