(function() {
  'use strict';

  angular.module('app.services')
      .factory('auth', auth);

  auth.$inject = ['$q', '$resource', '$state', '_', 'session', '$rootScope'];

  function auth($q, $resource, $state, _, session, $rootScope) {
    var authResource = $resource('', {}, {
      login: {
        method: 'POST',
        url: '/api/auth/login',
        isArray: false
      },
      getUser: {
        method: 'GET',
        url: '/api/admin/admins/:id'
      }
    });

    var service = {
      login: login,
      logout: logout,
      isLogged: isLogged,
      getUser: getUser,
      init: init,
    };

    return service;

    var currentUser

    function init() {
      var def = $q.defer();
      authResource.getUser({id: session.get('id')}).$promise
          .then(function(response) {
            currentUser = response.toJSON();

            def.resolve(currentUser);
          },
          function(err) {
            def.reject(err);
            logout();
          });

      return def.promise;
    }

    function login(credencials) {
      var promise = authResource.login(credencials).$promise;

      return promise.then(function(response) {
        var token = response.access_token;

        session.set('id', response.admin.id);
        session.set('token', token);

        currentUser = response.admin;
      });

      return promise;
    }

    function logout() {
      session.destroy('id');
      session.destroy('token');

      currentUser = undefined

      $state.go('app.login', {});
    }

    function isLogged() {
      if (session.get('id') && session.get('token')) return true;
      return false;
    }

    function getUser() {
      return currentUser;
    }
  }

})();