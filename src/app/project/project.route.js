(function() {
  'use strict';

  angular.module('app.project')
    .config(configFn);

    configFn.$inject = ['$stateProvider'];

    function configFn($stateProvider) {
      $stateProvider
        .state('app.project', {
          url: 'project/:projectId',
          controller: 'ProjectCtrl',
          controllerAs: 'vm',
          templateUrl: 'app/project/project.tpl.html',
          requiredLogin: true,
          resolve: {
            data: function(ProjectsService, RolesService, $stateParams, $q, $rootScope, resolvedUser, auth, AdminsService) {
              var promises = {
                projectResponse: ProjectsService.API.get($stateParams.projectId),
                projectsResponse: ProjectsService.API.list(),
                setActiveProject: AdminsService.setActiveProject($stateParams.projectId)
              }

              return $q.all(promises)
            }
          }
        });
    };

})();