(function() {
  'use strict';

  angular.module('app.services')
    .factory('session', session);

    session.$inject = ['localStorageService'];

    function session(localStorageService) {

      var service = {
        set: set,
        get: get,
        destroy: destroy
      };

      return service;

      function set(key, val) {
        return localStorageService.set(key, val);
      }

      function get(key) {
        return localStorageService.get(key);
      }

      function destroy(key) {
        return localStorageService.remove(key);
      }
    }

})();