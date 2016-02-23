(function() {
  'use strict';

  angular.module('app.project.dashboard.lottery')
    .config(configFn);

    configFn.$inject = ['$stateProvider'];

    function configFn($stateProvider) {
      $stateProvider
        .state('app.project.dashboard.lottery', {
          url: '/lottery',
          controller: 'LotteryCtrl',
          controllerAs: 'vm',
          templateUrl: 'app/project/dashboard/lottery/lottery.tpl.html',
          requiredLogin: true
        });
    };

})();