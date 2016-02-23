(function() {
  'use strict';

  angular.module('app.project.dashboard.quests')
      .config(configFn);

  configFn.$inject = ['$stateProvider'];

  function configFn($stateProvider) {
    $stateProvider
        .state('app.project.dashboard.quests', {
          url: '/quests',
          controller: 'QuestsCtrl',
          controllerAs: 'vm',
          templateUrl: 'app/project/dashboard/quests/quests.tpl.html',
          requiredLogin: true,
          permissions: [
            'quest_view'
          ],
          resolve: {
            preCompileTpl: function(helpers) {
              return helpers.precompileDecorator('app/project/dashboard/quests/table-cells.html')
            }
          },
        });
  };

})();