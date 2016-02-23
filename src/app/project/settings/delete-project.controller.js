(function() {
  'use strict';

  angular
      .module('app.project.settings')
      .controller('DeleteProjectCtrl', DeleteProjectCtrl);

  DeleteProjectCtrl.$inject = [
    'ProjectsService',
    '$modalInstance',
    '$stateParams',
    'toastr',
    'data',
    '$q'
  ];

  function DeleteProjectCtrl(ProjectsService,
                           $modalInstance,
                           $stateParams,
                           toastr,
                           data,
                           $q) {
    var vm = this;

    vm.remove = remove;
    vm.cancel = cancel;

    activate();

    function activate() {
      vm.project = data.project
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function remove() {
      return ProjectsService.API.remove(vm.project.id)
          .then(function(data) {
            $modalInstance.close(data.toJSON());
          }, function(error) {
            if (!error.data || !error.data.error || !error.data.error.fields) {
              toastr.error(error.data.error_reason || 'Server error');
            }
          });
    }
  }
})();