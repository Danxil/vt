(function() {
  'use strict';

  angular.module('app.project.user')
    .config(configFn);

    configFn.$inject = ['$stateProvider'];

    function configFn($stateProvider) {
      $stateProvider
        .state('app.project.user', {
          url: '/user/:userId',
          controller: 'UserCtrl',
          controllerAs: 'vm',
          templateUrl: 'app/project/user/user.tpl.html',
          requiredLogin: true,
          resolve: {
            data: function(UsersService, QuestsService, $stateParams, $q) {
              var promises = {}

              promises.userResponse = UsersService.API.get($stateParams.projectId, $stateParams.userId)
              promises.userAchievementsResponse = UsersService.API.getAchievements($stateParams.projectId, $stateParams.userId)

              return $q.all(promises)
            }
          }
        });
    };

})();