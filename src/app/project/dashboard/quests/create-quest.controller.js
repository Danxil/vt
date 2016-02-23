(function() {
  'use strict';

  angular
      .module('app.project.dashboard.quests')
      .controller('CreateQuestCtrl', CreateQuestCtrl);

  CreateQuestCtrl.$inject = ['QuestsService', '$modalInstance', '$stateParams', 'toastr'];

  function CreateQuestCtrl(QuestsService, $modalInstance, $stateParams, toastr) {
    var vm = this;

    vm.createQuest = createQuest;
    vm.cancel = cancel;

    vm.quest = {}
    vm.customErrors = {
      date: {
        date: 'Please, enter date in correct format',
        parse: ' '
      }
    }

    activate();

    function activate() {

    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function createQuest(data) {

      data.start_date = data.start_date ?
          moment(data.start_date).format('YYYY-MM-DD[T]HH:mm:ssZZ') :
          null

      data.end_date = data.end_date ?
          moment(data.end_date).format('YYYY-MM-DD[T]HH:mm:ssZZ') :
          null

      var promise = QuestsService.API.create($stateParams.projectId, data);
      promise.then(
          function(data) {
            $modalInstance.close(data);
          },
          function(error) {
            if (!error.data || !error.data.error || !error.data.error.fields) {
              toastr.error(error.data.error_reason || 'Server error');
            }
          })

      return promise;
    }
  }
})();