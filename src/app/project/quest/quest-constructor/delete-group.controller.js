(function() {
  'use strict';

  angular
      .module('app.project.quest.quest-constructor')
      .controller('DeleteGroupCtrl', DeleteGroupCtrl);

  DeleteGroupCtrl.$inject = [
    'AchievementGroupsService',
    'AchievementsService',
    '$modalInstance',
    '$stateParams',
    'toastr',
    'data',
    '$q'
  ];

  function DeleteGroupCtrl(AchievementGroupsService,
                           AchievementsService,
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
      vm.group = data.group
      vm.achievements = data.achievements
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function remove() {
      var promises = []

      vm.achievements.forEach(function(achievement) {
        promises.push(AchievementsService.API.remove($stateParams.projectId, achievement.id))
      })

      return $q.all(promises)
          .then(function() {
            return AchievementGroupsService.API.remove($stateParams.projectId, $stateParams.questId, vm.group.id)
          })
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