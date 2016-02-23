(function() {
  'use strict';

  angular.module('app.project.settings')
    .config(configFn)

    configFn.$inject = [
      '$stateProvider'
    ];

    function configFn(
      $stateProvider
    ) {
      $stateProvider
        .state('app.project.settings', {
          url: '/settings',
          controller: 'ProjectSettingsCtrl',
          controllerAs: 'vm',
          templateUrl: 'app/project/settings/project-settings.tpl.html',
          requiredLogin: true,
            resolve: {
              data: function (AchievementsService, $stateParams, data, $q, auth) {
                var promises = {
                  project: data.projectResponse
                }

                if (auth.getUser().is_super)
                  promises.usingCurrencies = AchievementsService.API.list($stateParams.projectId)
                    .then(function(response) {
                      var promises = _.map(response.results, function(achievement) {
                        return AchievementsService.API.getLogic($stateParams.projectId, achievement.id)
                      })

                      return $q.all(promises)
                    })
                    .then(function(achievementsLogic) {
                      return _.union.apply(this, _.map(achievementsLogic, function(achievementLogic) {
                        return _.map(achievementLogic.money_rewards, function(reward, currency) {
                          return currency
                        })
                      }))
                    })

                return $q.all(promises)
              }
            }
        });
    };
})();