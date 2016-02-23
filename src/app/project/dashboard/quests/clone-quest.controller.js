(function() {
  'use strict';

  angular
      .module('app.project.dashboard.quests')
      .controller('CloneQuestCtrl', CloneQuestCtrl);

  CloneQuestCtrl.$inject = [
    'QuestsService',
    'AchievementGroupsService',
    'AchievementsService',
    '$modalInstance',
    '$stateParams',
    'toastr',
    'data',
    '$q'
  ];

  function CloneQuestCtrl(QuestsService,
                          AchievementGroupsService,
                          AchievementsService,
                          $modalInstance,
                          $stateParams,
                          toastr,
                          data,
                          $q
  ) {
    var vm = this;

    vm.cloneQuest = cloneQuest;
    vm.cancel = cancel;

    activate();

    function activate() {
      vm.quest = data.quest
      vm.groups = data.groupsResponse.results
      vm.achievements = data.achievementsResponse
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function cloneQuest() {
      var questOmitFields = [
        'id',
        'progress',
        'status',
        'project_id',
        'create_date'
      ]

      var groupOmitFields = [
        'id',
      ]

      var achievementOmitFields = [
        'id',
        'project_id',
      ]

      var quest = _preparePostCloneQuest(vm.quest)

      return QuestsService.API.create($stateParams.projectId, _.omit(quest, questOmitFields))
        .then(function(questResponse) {
          var groupsPromises = _.map(vm.groups, function(group) {
            return AchievementGroupsService.API
              .create($stateParams.projectId, questResponse.id, _.omit(group, groupOmitFields))
              .then(function(groupResponse) {
                var selectedAchievements = _.filter(vm.achievements, function(achievement) {
                  return achievement.general.group_id == parseInt(group.id)
                })

                selectedAchievements.forEach(function(selectedAchievement) {
                  selectedAchievement.general.group_id = groupResponse.id
                })
              })
          })

          var promises = {
            questResponse: questResponse,
            groupsResponse: $q.all(groupsPromises)
          }

          return $q.all(promises)
        }).then(function(responses) {
          var achievementsPromises = _.map(vm.achievements, function(achievement) {
            achievement.general.quest_id = responses.questResponse.id

            return AchievementsService.API
              .create($stateParams.projectId, _.omit(achievement.general, achievementOmitFields))
          })

          return $q.all(achievementsPromises)
        })
        .then(function(generalAchievements) {
          var achievementsPromises = _.map(vm.achievements, function(achievement, index) {
            if (!achievement.logic) return

            _.each(achievement.logic.depends_on, function(deependId, deependIndex) {
              var achievementIndex = _.findIndex(vm.achievements, 'general.id', deependId)

              achievement.logic.depends_on[deependIndex] = generalAchievements[achievementIndex].id
            })

            return AchievementsService.API
              .setLogic($stateParams.projectId, generalAchievements[index].id, achievement.logic)
          })

          return $q.all(achievementsPromises)
        })
        .then(function() {
          $modalInstance.close();
        })
    }

    function _preparePostCloneQuest(quest) {
      quest = _.cloneDeep(quest)

      var now = moment()

      quest.start_date = quest.start_date ?
          moment(quest.start_date) :
          null
      quest.end_date = quest.end_date ?
          moment(quest.end_date) :
          null

      if (quest.start_date && now.diff(quest.start_date) >= 0)
        quest.start_date = moment(now).add(1, 'minutes')

      if (quest.start_date && quest.end_date && quest.end_date.diff(quest.start_date) <= 0)
        quest.end_date = moment(quest.start_date).add(1, 'days')

      quest.start_date = quest.start_date ?
          quest.start_date.format('YYYY-MM-DD[T]HH:mm:ssZZ') :
          null
      quest.end_date = quest.end_date ?
          quest.end_date.format('YYYY-MM-DD[T]HH:mm:ssZZ') :
          null

      quest.name = '[Clone] ' + quest.name

      return quest
    }
  }
})();