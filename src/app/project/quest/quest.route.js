(function() {
  'use strict';

  angular.module('app.project.quest')
      .config(configFn);

  configFn.$inject = ['$stateProvider'];

  function configFn($stateProvider) {
    $stateProvider
        .state('app.project.quest', {
          url: '/quest/:questId',
          controller: 'QuestCtrl',
          controllerAs: 'vm',
          templateUrl: 'app/project/quest/quest.tpl.html',
          requiredLogin: true,
          resolve: {
            data: function(QuestsService, $stateParams, $q, data) {
              var promises = {
                questResponse: QuestsService.API.get($stateParams.projectId, $stateParams.questId),
                project: data.projectResponse
              }

              return $q.all(promises)
            }
          },
        });
  };

})();