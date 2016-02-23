(function() {
  'use strict';

  angular.module('app.project.quest.quest-info')
    .config(configFn);

    configFn.$inject = ['$stateProvider'];

    function configFn($stateProvider) {
      $stateProvider
        .state('app.project.quest.quest-info', {
          url: '/quest-info',
          controller: 'QuestInfoCtrl',
          controllerAs: 'vm',
          templateUrl: 'app/project/quest/quest-info/quest-info.tpl.html',
          requiredLogin: true,
          resolve: {
            data: function(data, ProjectsService, $stateParams, $q) {
              var promises = {}

              promises.questTimezonesPromise = ProjectsService.API.getQuestTimezones($stateParams.projectId)

              return $q.all(promises)
            }
          }
        });
    };

})();