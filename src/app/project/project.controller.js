(function() {
  'use strict';

  angular
      .module('app.project')
      .controller('ProjectCtrl', ProjectCtrl);

  ProjectCtrl.$inject = ['$state', '$stateParams', '$scope', 'data', 'AdminsService'];

  function ProjectCtrl($state, $stateParams, $scope, data, AdminsService) {
    var vm = this;

    vm.$state = $state;

    $scope.hasProjectPermission = AdminsService.hasProjectPermission;

    activate();

    function activate() {
      $scope.projects = data.projectsResponse.results;
      $scope.project = data.projectResponse;
    }
  }
})();