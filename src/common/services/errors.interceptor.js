(function() {
  'use strict';

  angular.module('app.services')
    .factory('errorsInterceptor', errorsInterceptor);

    errorsInterceptor.$inject = ['$q', '$timeout', '$injector'];

    function errorsInterceptor($q, $timeout, $injector) {
      var $state;

      $timeout(function () {
        $state = $injector.get('$state');
      });
      return {
        responseError: function (response) {
          if(response.status === 403) {
            if(response.data.error_subcode === 7){
              $state.go('app.projects');
            }
          }
          if(response.status === 500) {
            response.data = {
              error: {},
              error_code: 500,
              error_reason: "Internal Server Error"
            };
          }
          return $q.reject(response);
        }
      }

    }

})();