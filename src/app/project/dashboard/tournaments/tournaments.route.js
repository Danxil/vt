(function() {
  'use strict';

  angular.module('app.project.dashboard.tournaments')
    .config(configFn);

    configFn.$inject = ['$stateProvider'];

    function configFn($stateProvider) {
      $stateProvider
        .state('app.project.dashboard.tournaments', {
          url: '/tournaments',
          controller: 'TournamentsCtrl',
          controllerAs: 'vm',
          templateUrl: 'app/project/dashboard/tournaments/tournaments.tpl.html',
          requiredLogin: true
        });
    };

})();