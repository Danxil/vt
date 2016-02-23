(function() {
  'use strict';

  angular.module('app.project.quest.quest-stat')
    .controller('QuestStatCtrl', QuestStatCtrl);

  QuestStatCtrl.$inject = [
    'NgTableParams',
    'QuestsService',
    'data',
    'UsersService',
    '$stateParams'
  ];

  function QuestStatCtrl(
      NgTableParams,
      QuestsService,
      data,
      UsersService,
      $stateParams
  ) {
    var vm = this;

    vm.loadCompletedUsers = loadCompletedUsers

    activate()

    function activate() {
      vm.groups = data.groupsResponse.results
      vm.tableParams = initTableParams();

      vm.popover = {
        title: 'Users',
        contentTemplate: 'app/project/quest/quest-stat/completed-users.tpl.html',
        autoClose: true,
      }
    }

    function initTableParams() {
      return new NgTableParams({
        count: 10,
      }, {
        filterDelay: 300,
        total: 0,
        getData: function($defer, params) {
          QuestsService.API.getStat($stateParams.projectId, $stateParams.questId, params.sorting())
              .then(function(response) {
                vm.stat = response

                vm.stat.results.forEach(function(achievement) {
                  achievement.linkQuery = JSON.stringify({completed: [achievement.id]})
                })

                $defer.resolve(vm.stat);
              });
        }
      });
    }

    function loadCompletedUsers(achievement) {
      return UsersService.API.list($stateParams.projectId, null, {completed: [achievement.id]})
        .then(function(response) {
          achievement.completedUsers = response.results
        })
    }
  };
})();