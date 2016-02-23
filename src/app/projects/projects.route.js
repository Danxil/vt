(function() {
  'use strict';

  angular.module('app.projects')
    .config(configFn);

    configFn.$inject = ['$stateProvider'];

    function configFn($stateProvider) {
      $stateProvider
        .state('app.projects', {
          url: '',
          controller: 'ProjectsCtrl',
          controllerAs: 'vm',
          templateUrl: 'app/projects/projects.tpl.html',
          requiredLogin: true,
          resolve: {
            data: function (ProjectsService, $q) {
              var promises = {
                projectsResponse: ProjectsService.API.list()
              }

              return $q.all(promises);
            }
          }
        });
    };

})();