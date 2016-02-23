(function() {
  'use strict';

  angular.module('app.project.dashboard')
      .config(configFn)
      .run(runFn);

  configFn.$inject = ['$stateProvider'];
  runFn.$inject = ['$rootScope', '$state'];

  function configFn($stateProvider) {
    $stateProvider.state('app.project.dashboard', {
      url: '/dashboard',
      controller: 'DashboardCtrl',
      controllerAs: 'vm',
      templateUrl: 'app/project/dashboard/dashboard.tpl.html',
      requiredLogin: true,

    });
  };

  function runFn($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      if (toState.name === 'app.project.dashboard') {
        event.preventDefault();
        $state.go('app.project.dashboard.quests', toParams);
      }
    });
  }

})();