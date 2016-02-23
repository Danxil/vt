(function() {
  'use strict';

  angular
      .module('app.project.quest.quest-info')
      .controller('DeleteQuestCtrl', DeleteQuestCtrl);

  DeleteQuestCtrl.$inject = [
    'QuestsService',
    '$modalInstance',
    '$stateParams',
    'toastr',
    'data',
    '$q'
  ];

  function DeleteQuestCtrl(QuestsService,
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
      vm.quest = data.quest
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function remove() {
      return QuestsService.API.remove($stateParams.projectId, vm.quest.id)
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