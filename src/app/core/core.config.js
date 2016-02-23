(function() {
  'use strict';

  angular.module('app.core')
      .config(configFn)
      .run(runFn);

  configFn.$inject = [
    '$locationProvider',
    '$resourceProvider',
    '$httpProvider',
    '$tooltipProvider',
    'localStorageServiceProvider',
    'toastr',
    'TIME_ZONES'
  ];

  function configFn($locationProvider,
                    $resourceProvider,
                    $httpProvider,
                    $tooltipProvider,
                    localStorageServiceProvider,
                    toastr,
                    TIME_ZONES
  ) {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    localStorageServiceProvider.setPrefix('vortex');

    $locationProvider.html5Mode(true);

    $resourceProvider.defaults.stripTrailingSlashes = false;

    $httpProvider.interceptors.push('httpLoadingInterceptor');

    $httpProvider.interceptors.push('authInterceptor');

    $httpProvider.interceptors.push('errorsInterceptor');

    //date popup bug
    $tooltipProvider.defaults.autoClose = false;

    moment.tz.add(TIME_ZONES)
  }

  runFn.$inject = ['$rootScope', '$state', 'auth', 'toastr', '$stateParams', 'STORAGE_PATH'];

  function runFn($rootScope, $state, auth, toastr, $stateParams, STORAGE_PATH) {
    $rootScope.$stateParams = $stateParams
    $rootScope.auth = auth
    $rootScope.STORAGE_PATH = STORAGE_PATH
    $rootScope._ = _

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.requiredLogin && !auth.isLogged()) {
        event.preventDefault();
        $state.go('app.login');
      }

      if (toState.isSuperuser && auth.getUser() && !auth.getUser().is_super) {
        event.preventDefault();
        toastr.error('You do not have superuser permission');
      }
    })
  }

})();
