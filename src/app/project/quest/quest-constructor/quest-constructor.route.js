(function() {
  'use strict';

  angular.module('app.project.quest.quest-constructor')
    .config(configFn);

  configFn.$inject = ['$stateProvider'];

  function configFn($stateProvider) {
    $stateProvider
      .state('app.project.quest.quest-constructor', {
        url: '/quest-constructor',
        controller: 'QuestConstructorCtrl',
        controllerAs: 'vm',
        templateUrl: 'app/project/quest/quest-constructor/quest-constructor.tpl.html',
        requiredLogin: true,
        resolve: {
          data: function(AchievementsService,
                         AchievementGroupsService,
                         $stateParams,
                         $q,
                         AdminsService,
                         data) {
            var promises = {
              project: data.project
            }

            if (AdminsService.hasProjectPermission('achievement_view')) {
              promises.achievementsResponse = AchievementsService.API
                .list($stateParams.projectId, {quest_id: $stateParams.questId})

              promises.groupsResponse = AchievementGroupsService.API
                .list($stateParams.projectId, $stateParams.questId)
            }

            return $q.all(promises)
          },
          preCompileTpl: function(helpers) {
            return helpers.precompileDecorator('app/project/quest/quest-constructor/achievements-group.tpl.html')
          }
        },
      });
  };

})();