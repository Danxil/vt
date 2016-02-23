(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('AchievementsService', AchievementsService);

  AchievementsService.$inject = ['$resource', 'helpers'];

    function AchievementsService($resource, helpers) {
      var achievementsResource = $resource('/api/admin/project/:projectId/achievement', {}, {
        list: {
          method: 'GET',
          url: '/api/admin/project/:projectId/achievement',
        },
        create: {
          method: 'POST',
          url: '/api/admin/project/:projectId/achievement'
        },
        get: {
          method: 'GET',
          url: '/api/admin/project/:projectId/achievement/:achievementId'
        },
        update: {
          method: 'PATCH',
          url: '/api/admin/project/:projectId/achievement/:achievementId'
        },
        remove: {
          method: 'DELETE',
          url: '/api/admin/project/:projectId/achievement/:achievementId'
        },
        setLogic: {
          method: 'PUT',
          url: '/api/admin/project/:projectId/achievement/:achievementId/logic'
        },
        getLogic: {
          method: 'GET',
          url: '/api/admin/project/:projectId/achievement/:achievementId/logic'
        },
        removeImage: {
          method: 'DELETE',
          url: '/api/admin/project/:projectId/achievement/:achievementId/image'
        },
        test: {
          method: 'POST',
          url: '/api/admin/project/:projectId/achievement/:achievementId/test'
        },
      });

      var service = {
        API: {
          list: list,
          create: create,
          get: get,
          update: update,
          remove: remove,
          setLogic: setLogic,
          getLogic: getLogic,
          removeImage: removeImage,
          test: test,
        }
      };

      return service;

      //------------------------ API methods ---------------------------

      function list(projectId, paramsFilter) {
        var requestParams = helpers.getRequestParams(null, paramsFilter, null);
        angular.extend(requestParams, {projectId: projectId});

        return achievementsResource.list(requestParams).$promise;
      }

      function create(projectId, data) {
          return achievementsResource.create({projectId: projectId}, data).$promise;
      }

      function get(projectId, achievementId) {
          return achievementsResource.get({projectId: projectId, achievementId: achievementId}).$promise;
      }

      function update(projectId, achievementId, data) {
          return achievementsResource.update({projectId: projectId, achievementId: achievementId}, data).$promise;
      }

      function remove(projectId, achievementId) {
        return achievementsResource.remove({projectId: projectId, achievementId: achievementId}).$promise;
      }

      function setLogic(projectId, achievementId, data) {
        return achievementsResource.setLogic({
          projectId: projectId,
          achievementId: achievementId
        }, data).$promise;
      }

      function getLogic(projectId, achievementId) {
        return achievementsResource.getLogic({
          projectId: projectId,
          achievementId: achievementId
        }).$promise;
      }

      function removeImage(projectId, achievementId) {
        return achievementsResource.removeImage({projectId: projectId, achievementId: achievementId}).$promise;
      }

      function test(projectId, achievementId, data) {
        return achievementsResource.test({projectId: projectId, achievementId: achievementId}, data).$promise;
      }
    }
})();