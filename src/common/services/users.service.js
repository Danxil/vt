(function () {
  'use strict';

  angular
    .module('app.services')
    .factory('UsersService', UsersService);

  UsersService.$inject = ['$resource', 'helpers'];

  function UsersService($resource, helpers) {
    var usersResource = $resource('/api/admin/user/', {}, {
      list: {
        method: 'GET',
        url: '/api/admin/project/:projectId/user'
      },
      get: {
        method: 'GET',
        url: '/api/admin/project/:projectId/user/:userId'
      },
      getAchievements: {
        method: 'GET',
        url: '/api/admin/project/:projectId/user/:userId/achievements'
      }
    });

    var service = {
      API: {
        list: list,
        get: get,
        getAchievements: getAchievements
      }
    };

    return service;

    //------------------------ API methods ---------------------------

    function list(projectId, paramsPages, paramsFilter, paramsSorting) {
      var requestParams = helpers.getRequestParams(paramsPages, paramsFilter, paramsSorting);
      angular.extend(requestParams, {projectId: projectId});
      return usersResource.list(requestParams).$promise;
    }

    function get(projectId, userId){
      return usersResource.get({projectId: projectId, userId: userId}).$promise;
    }

    function getAchievements(projectId, userId){
      return usersResource.getAchievements({projectId: projectId, userId: userId}).$promise;
    }
  }
})();
