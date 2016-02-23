(function() {
  'use strict';

  angular.module('app.services')
    .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$q', '$timeout', '$injector', 'session'];

    function authInterceptor($q, $timeout, $injector, session) {
      var $state;

      $timeout(function () {
        $state = $injector.get('$state');
      });
      return {
        request: function(config) {
           config.headers = config.headers || {};
           var token = session.get('token');
           if(token) {
            config.headers.Authorization = token;
           }

           return config;
        },
        responseError: function(response) {
          if(response.status === 401){
            $state.go('app.login');
          }
          return $q.reject(response);
        }
      }

    }

})();