(function() {
  'use strict';

  angular.module('app.project.users')
    .config(configFn);

    configFn.$inject = ['$stateProvider'];

    function configFn($stateProvider) {
      $stateProvider
        .state('app.project.users', {
          url: '/users?filter?resolve',
          controller: 'UsersCtrl',
          controllerAs: 'vm',
          templateUrl: 'app/project/users/users.tpl.html',
          requiredLogin: true,
          reloadOnSearch: false,
          resolve: {
            data: function(QuestsService, $stateParams, $q) {
              var promises = {
                questsResponse: QuestsService.API.list($stateParams.projectId)
              }

              return $q.all(promises)
            },
            preCompileTpl: function(helpers) {
              return helpers.precompileDecorator('app/project/users/table-cells.html')
            }
          },
        });
    };

})();