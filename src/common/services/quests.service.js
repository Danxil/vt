(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('QuestsService', QuestsService);

    QuestsService.$inject = ['$resource', 'helpers'];

    function QuestsService($resource, helpers) {
      var questsResource = $resource('/api/admin/quest/', {}, {
        list: {
            method: 'GET',
            url: '/api/admin/project/:projectId/quest',
        },
        create: {
            method: 'POST',
            url: '/api/admin/project/:projectId/quest'
        },
        get: {
            method: 'GET',
            url: '/api/admin/project/:projectId/quest/:questId'
        },
        update: {
            method: 'PATCH',
            url: '/api/admin/project/:projectId/quest/:questId'
        },
        remove: {
          method: 'DELETE',
          url: '/api/admin/project/:projectId/quest/:questId'
        },
        getStat: {
          method: 'GET',
          url: '/api/admin/project/:projectId/quest/:questId/stats'
        },
      });

      var service = {
        API: {
          list: list,
          create: create,
          get: get,
          update: update,
          getStat: getStat,
          remove: remove
        }
      };

      return service;

      //------------------------ API methods ---------------------------

      function list(projectId, paramsPages, paramsFilter, paramsSorting) {
        var requestParams = helpers.getRequestParams(paramsPages, paramsFilter, paramsSorting);
        angular.extend(requestParams, {projectId: projectId});
        return questsResource.list(requestParams).$promise;
      }

      function create(projectId, data) {
          return questsResource.create({projectId: projectId}, data).$promise;
      }

      function get(projectId, questId) {
          return questsResource.get({projectId: projectId, questId: questId}).$promise;
      }

      function update(projectId, questId, data) {
          return questsResource.update({projectId: projectId, questId: questId}, data).$promise;
      }

      function remove(projectId, questId) {
        return questsResource.remove({projectId: projectId, questId: questId}).$promise;
      }

      function getStat(projectId, questId, paramsSorting) {
        var requestParams = helpers.getRequestParams(null, null, paramsSorting);
        angular.extend(requestParams, {projectId: projectId, questId: questId});
        return questsResource.getStat(requestParams).$promise;
      }

      //--------------------- Other service methods ---------------------

    }
})();