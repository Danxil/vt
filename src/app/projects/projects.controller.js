(function() {
  'use strict';

  angular
      .module('app.projects')
      .controller('ProjectsCtrl', ProjectsCtrl);

  ProjectsCtrl.$inject = ['$modal', 'ProjectsService', 'data', '$scope'];

  function ProjectsCtrl($modal, ProjectsService, data, $scope) {
    var vm = this;

    vm.createProject = createProject;

    activate();

    function activate() {
      $scope.projects = data.projectsResponse.results;
    }

    function createProject() {
      $modal.open({
        templateUrl: 'app/projects/create-new-project.tpl.html',
        controller: 'CreateProjectCtrl',
        controllerAs: 'vm'
      }).result.then(
          function(data) {
            $scope.projects.push(data);
          }
      );
    }
  }
})();