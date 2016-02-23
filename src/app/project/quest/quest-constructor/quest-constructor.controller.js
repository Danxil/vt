(function() {
  'use strict';

  angular.module('app.project.quest.quest-constructor')
      .controller('QuestConstructorCtrl', QuestConstructorCtrl);

  QuestConstructorCtrl.$inject = [
    '$stateParams',
    '$modal',
    'data',
    'AchievementsService',
    'QuestsService',
    '$q',
    '$filter',
    '$scope'
  ];

  function QuestConstructorCtrl(
    $stateParams,
    $modal,
    data,
    AchievementsService,
    QuestsService,
    $q,
    $filter,
    $scope
  ) {
    var vm = this;

    vm.$stateParams = $stateParams;

    vm.removeAchievement = removeAchievement;
    vm.createAchievement = createAchievement;
    vm.updateAchievement = updateAchievement;

    vm.removeGroup = removeGroup;
    vm.createGroup = createGroup;
    vm.updateGroup = updateGroup;

    _activate();

    function _activate() {
      if ($scope.hasProjectPermission('achievement_view')) {
        vm.groups = data.groupsResponse.results;
        vm.achievements = data.achievementsResponse.results;
      }
    }

    //####### Ahievements actions #######

    function updateAchievement(achievementData) {
      function dataResolve() {
        var promises = {
          project: data.project,
          groups: vm.groups,
          achievement: achievementData,
          achievements: _.filter(vm.achievements, function(achievement) {
            return achievement.id != achievementData.id
          })
        }

        if ($scope.hasProjectPermission('achievement_logic'))
          promises.logicResponse = AchievementsService.API.getLogic($stateParams.projectId, achievementData.id)
              .then(function(response) {
                return response.toJSON()
              })

        return $q.all(promises)
      }

      $modal.open({
        templateUrl: 'app/project/quest/quest-constructor/create-update-achievement.tpl.html',
        controller: 'CreateUpdateAchievementCtrl',
        controllerAs: 'vm',
        keyboard: false,
        backdrop: 'static',
        scope: $scope,
        resolve: {
          data: dataResolve
        }
      }).result.then(function(result) {
            _.assign(achievementData, result)
        });
    }

    function createAchievement(group) {
      function dataResolve() {
        var promises = {}

        promises.project = data.project
        promises.groups = vm.groups
        promises.achievements = vm.achievements
        promises.defaultAchievement = {
          group_id: group.id,
          description: ''
        }

        promises.questsResponse = QuestsService.API.list($stateParams.projectId)

        return $q.all(promises)
      }

      $modal.open({
        templateUrl: 'app/project/quest/quest-constructor/create-update-achievement.tpl.html',
        controller: 'CreateUpdateAchievementCtrl',
        controllerAs: 'vm',
        keyboard: false,
        backdrop: 'static',
        scope: $scope,
        resolve: {
          data: dataResolve
        }
      }).result.then(function(result) {
            vm.achievements.push(result)
          });
    }

    function removeAchievement(data) {
      $modal.open({
        templateUrl: 'app/project/quest/quest-constructor/delete-achievement.tpl.html',
        controller: 'DeleteAchievementCtrl',
        controllerAs: 'vm',
        resolve: {
          data: function() {
            return {
              achievement: data,
            }
          }
        }
      }).result.then(function(result) {
            vm.achievements.forEach(function(item, index) {
              if (item.id == data.id)
                vm.achievements.splice(index, 1)
            })
          });
    }

    //####### Groups actions #######

    function updateGroup(data) {

      $modal.open({
        templateUrl: 'app/project/quest/quest-constructor/create-update-group.tpl.html',
        controller: 'CreateUpdateGroupCtrl',
        controllerAs: 'vm',
        resolve: {
          data: function() {
            return {
              group: data
            }
          }
        }
      }).result.then(function(result) {
            _.each(result, function(item, key) {
              data[key] = item
            })
          });
    }

    function createGroup() {
      $modal.open({
        templateUrl: 'app/project/quest/quest-constructor/create-update-group.tpl.html',
        controller: 'CreateUpdateGroupCtrl',
        controllerAs: 'vm',
        resolve: {
          data: function() {
            return {}
          }
        }
      }).result.then(function(result) {
            vm.groups.push(result)
          });
    }

    function removeGroup(data) {
      $modal.open({
        templateUrl: 'app/project/quest/quest-constructor/delete-group.tpl.html',
        controller: 'DeleteGroupCtrl',
        controllerAs: 'vm',
        resolve: {
          data: function() {
            return {
              group: data,
              achievements: $filter('filter')(vm.achievements, {group_id: data.id}),
            }
          }
        }
      }).result.then(function() {
            vm.groups.forEach(function(item, index) {
              if (item.id == data.id)
                vm.groups.splice(index, 1)
            })
          });
    }
  };

})();