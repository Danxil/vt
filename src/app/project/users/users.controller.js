(function() {
  'use strict';

  angular.module('app.project.users')
    .controller('UsersCtrl', UsersCtrl);

  UsersCtrl.$inject = [
    'NgTableParams',
    'UsersService',
    '$stateParams',
    '$state',
    '$scope',
    'AchievementsService',
    'data'
  ];

  function UsersCtrl(NgTableParams,
                     UsersService,
                     $stateParams,
                     $state,
                     $scope,
                     AchievementsService,
                     data) {
    var vm = this;

    vm.cols = [
      'ID',
      'Name',
      'Email',
      'Total Quests',
      'Total Achieves #',
      'Last Visit',
    ];

    _activate()

    function _activate() {
      vm.tableParams = initTableParams();
      vm.quests = data.questsResponse.results

      if ($stateParams.filter) {
        vm.showFilters = true

        angular.extend(vm.tableParams.filter(), JSON.parse($stateParams.filter))
      }

      if (vm.tableParams.filter().completed) {
        var achievementId = vm.tableParams.filter().completed[0]

        AchievementsService.API.get($stateParams.projectId, achievementId).then(function(response) {
          vm.selectedQuest = _.find(vm.quests, {id: response.quest_id})
        })
      }

      $scope.$watch('vm.selectedQuest', _getQuestAchievements)
      $scope.$watch('vm.tableParams.filter()', _filterChanged, true)
    }

    function initTableParams() {
      return new NgTableParams({
        page: 1,
        count: 10,
      }, {
        filterDelay: 300,
        total: 0,
        getData: function($defer, params) {
          UsersService.API.list($stateParams.projectId, params.url(), params.filter(), params.sorting())
            .then(function(response) {
              if (_.isEmpty(params.filter()))
                vm.total = response.total;

              params.total(vm.total = response.total);
              $defer.resolve(vm.users = response.results);
            });
        }
      });
    }

    function _filterChanged(nevVal, oldVal) {
      if (!oldVal) return

      var params = {
        projectId: $stateParams.projectId
      }

      _.each(nevVal, function(value, key) {
        if (_.isEmpty(value))
          delete nevVal[key]
      })

      if (!_.isEmpty(nevVal))
        params.filter = nevVal

      params.filter = JSON.stringify(params.filter)

      $state.go('.', params)
    }

    function _getQuestAchievements(quest) {
      //vm.tableParams.filter().completed = []

      if (!quest) return

      AchievementsService.API.list($stateParams.projectId, {quest_id: quest.id})
        .then(function(response) {
          vm.questAchievements = response.results
        })
    }
  };

})();