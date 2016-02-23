(function() {
  'use strict';

  angular.module('app.project.dashboard.quests')
    .controller('QuestsCtrl', QuestsCtrl);

  QuestsCtrl.$inject = [
    '$modal',
    'NgTableParams',
    'QuestsService',
    'AchievementsService',
    'AchievementGroupsService',
    '$stateParams',
    '$scope',
    '$q'
  ];

  function QuestsCtrl($modal,
                      NgTableParams,
                      QuestsService,
                      AchievementsService,
                      AchievementGroupsService,
                      $stateParams,
                      $scope,
                      $q) {
    var vm = this;


    vm.createQuest = createQuest;
    vm.cloneQuest = cloneQuest;

    vm.cols = [
      'ID',
      'Quest Name',
      'Owner',
      'Type',
      'Start Date',
      'End Date',
      'Create Date',
      'Progress'
    ];

    _activate()

    function _activate() {
      if ($scope.hasProjectPermission('quest_view'))
        vm.tableParams = initTableParams();

      var cloneQuestPermission = $scope.hasProjectPermission('quest_edit') &&
          $scope.hasProjectPermission('achievement_logic') &&
          $scope.hasProjectPermission('achievement_edit')

      if (cloneQuestPermission)
        vm.cols.push('Action')

      vm.progressFilterOptions = [
        {
          value: 'creation',
          label: 'Creation'
        },
        {
          value: 'ready',
          label: 'Ready'
        },
        {
          value: 'stopped',
          label: 'Stopped'
        },
        {
          value: 'in_progress',
          label: 'In progress'
        },
        {
          value: 'finished',
          label: 'Finished'
        },
        {
          value: 'periodic',
          label: 'Periodic'
        },
      ]
    }

    function _calcQuestProgress(quest) {
      var startDate = new Date(quest.start_date)
      var endDate = new Date(quest.end_date)
      var createDate = new Date(quest.create_date)
      var currentDate = new Date()

      var startDateTime = startDate.getTime()
      var endDateTime = endDate.getTime()
      var createDateTime = createDate.getTime()
      var currentDateTime = currentDate.getTime()

      switch (quest.status) {
        case 'disabled':
          if (startDateTime > currentDateTime || !startDateTime)
            return 'creation'
          else if ((startDateTime <= currentDateTime && endDateTime > currentDateTime) || !endDateTime)
            return 'stopped'
          else if (startDateTime <= currentDateTime && endDateTime <= currentDateTime)
            return 'finished'

          break;
        case 'enabled':
          if (!endDateTime && startDateTime && startDateTime <= currentDateTime)
            return 'inProgress'
          if ((startDateTime > currentDateTime))
            return 'ready'
          else if (startDateTime && endDateTime <= currentDateTime)
            return 'finished'
          else
            return Math.floor(100 / ((endDateTime - startDateTime) / (currentDate - startDateTime)))

          break;
      }
    }

    function initTableParams() {
      return new NgTableParams({
        page: 1,
        count: 10,
      }, {
        total: 0,
        getData: function($defer, params) {
          QuestsService.API.list($stateParams.projectId, params.url(), params.filter(), params.sorting())
            .then(function(response) {
              if (_.isEmpty(params.filter())) {
                vm.total = response.total;
              }

              params.total(response.total);

              response.results.forEach(function(item, index) {
                item.progress = _calcQuestProgress(item)
              })

              $defer.resolve(vm.quests = response.results);
            });
        }
      })
    }

    function cloneQuest(quest) {
      function dataResolve() {
        var promise = {}

        promise.quest = quest
        promise.groupsResponse = AchievementGroupsService.API.list($stateParams.projectId, quest.id)
        promise.achievementsResponse = AchievementsService.API
          .list($stateParams.projectId, {quest_id: quest.id})
          .then(function(achievementsResponse) {
            var promises = _.map(achievementsResponse.results, function(achievement) {
              var promise = {}

              promise.general = achievement

              if ($scope.hasProjectPermission('achievement_logic'))
                promise.logic = AchievementsService.API.getLogic($stateParams.projectId, achievement.id)

              return $q.all(promise)
            })

            return $q.all(promises)
          })

        return $q.all(promise)
      }

      $modal.open({
        templateUrl: 'app/project/dashboard/quests/clone-quest.tpl.html',
        controller: 'CloneQuestCtrl',
        controllerAs: 'vm',
        resolve: {
          data: dataResolve
        }
      }).result.then(function(data) {
          vm.tableParams.reload()
        });
    }

    function createQuest() {
      $modal.open({
        templateUrl: 'app/project/dashboard/quests/create-quest.tpl.html',
        controller: 'CreateQuestCtrl',
        controllerAs: 'vm'
      }).result.then(function(data) {
          vm.tableParams.reload()
        });
    }
  };

})();