(function() {
  'use strict';

  angular
      .module('app.projects')
      .controller('CreateProjectCtrl', CreateProjectCtrl);

  CreateProjectCtrl.$inject = ['ProjectsService', '$modalInstance', '$stateParams', 'toastr'];

  function CreateProjectCtrl(ProjectsService, $modalInstance, $stateParams, toastr) {
    var vm = this;

    vm.createProject = createProject;
    vm.cancel = cancel;

    activate();

    function activate() {
      vm.project = {
        name: '',
        description: '',
      }
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function createProject(data) {
      data.notification_url = data.notification_url || null
      data.amqp_url = data.amqp_url || null

      var promise = ProjectsService.API.create(data);
      promise.then(
          function(data) {
            $modalInstance.close(data);
          },
          function(error) {
            if (!error.data || !error.data.error || !error.data.error.fields) {
              toastr.error(error.data.error_reason || 'Server error');
            }
          });
      return promise;
    }
  }
})();