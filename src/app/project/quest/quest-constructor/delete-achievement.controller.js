(function() {
  'use strict';

  angular
      .module('app.project.quest.quest-constructor')
      .controller('DeleteAchievementCtrl', DeleteAchievementCtrl);

  DeleteAchievementCtrl.$inject = ['AchievementsService', '$modalInstance', '$stateParams', 'toastr', 'data'];

  function DeleteAchievementCtrl(AchievementsService, $modalInstance, $stateParams, toastr, data) {
    var vm = this;

    vm.remove = remove;
    vm.cancel = cancel;

    activate();

    function activate() {
      vm.achievement = data.achievement
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function remove() {
      return AchievementsService.API.remove($stateParams.projectId, vm.achievement.id)
          .then(function(data) {
            $modalInstance.close(data);
          }, function(error) {
            if (!error.data || !error.data.error || !error.data.error.fields) {
              toastr.error(error.data.error_reason || 'Server error');
            }
          });
    }
  }
})();