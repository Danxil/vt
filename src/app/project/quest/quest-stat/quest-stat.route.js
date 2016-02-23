(function() {
  'use strict';

  angular.module('app.project.quest.quest-stat')
    .config(configFn);

    configFn.$inject = ['$stateProvider'];

    function configFn($stateProvider) {
      $stateProvider
        .state('app.project.quest.quest-stat', {
          url: '/quest-stat',
          controller: 'QuestStatCtrl',
          controllerAs: 'vm',
          templateUrl: 'app/project/quest/quest-stat/quest-stat.tpl.html',
          requiredLogin: true,
          resolve: {
            data: function(QuestsService, AchievementGroupsService, $stateParams, $q) {
              var promise = {}

              promise.groupsResponse = AchievementGroupsService.API.list($stateParams.projectId, $stateParams.questId)

              return $q.all(promise)
            }
          }
        });
    };

})();