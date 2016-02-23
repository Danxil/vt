(function () {
  'use strict';

  angular
      .module('app.services')
      .factory('httpLoadingInterceptor', httpLoadingInterceptor);

  httpLoadingInterceptor.$inject = [
    '$rootScope',
    '$q',
    '$timeout'
  ];

  function httpLoadingInterceptor($rootScope,
                                  $q,
                                  $timeout
  ) {
    var minLoaderTime = 500
    var numLoadings = 0;
    var startTime

    return {
      request: function (config) {
        if(numLoadings == 0) {
          $rootScope.$broadcast("loader_show");
        }

        numLoadings++;

        if (numLoadings == 1)
          startTime = new Date().getTime()

        return config || $q.when(config)
      },
      response: function (response) {
        var timeout = minLoaderTime - (new Date().getTime() - startTime)

        if (timeout < 0)
          timeout = 0

        $timeout(function() {
          if(!(--numLoadings)){
            $rootScope.$broadcast("loader_hide");
          }
        }, timeout)

        return response || $q.when(response);
      },
      responseError: function (response) {
        var timeout = minLoaderTime - (new Date().getTime() - startTime)

        if (timeout < 0)
          timeout = 0

        $timeout(function() {
          if (!(--numLoadings)) {
            $rootScope.$broadcast("loader_hide");
          }
        }, timeout)

        return $q.reject(response);
      }
    };
  };
})();
