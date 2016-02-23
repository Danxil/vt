(function() {
  'use strict';

  angular
      .module('app.project.quest.quest-constructor')
      .controller('CreateUpdateGroupCtrl', CreateUpdateGroupCtrl);

  CreateUpdateGroupCtrl.$inject = ['AchievementGroupsService', '$modalInstance', '$stateParams', 'data'];

  function CreateUpdateGroupCtrl(AchievementGroupsService, $modalInstance, $stateParams, data) {
    var vm = this;

    vm.submit = submit;
    vm.cancel = cancel;

    activate();

    function activate() {
      data = data || {}

      vm.action = data.group ? 'update' : 'create';
      vm.group = _.clone(data.group) || {}
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function submit() {
      var action =
          data.group ?
              AchievementGroupsService.API.update :
              AchievementGroupsService.API.create;

      var args = vm.action == 'update' ?
          [$stateParams.projectId, $stateParams.questId, vm.group.id, _.omit(vm.group, 'id')] :
          [$stateParams.projectId, $stateParams.questId, vm.group];

      return action.apply(this, args)
          .then(function(data) {
            $modalInstance.close(data.toJSON());
          });
    }
  }
})();