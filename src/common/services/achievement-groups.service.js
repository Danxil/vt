(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('AchievementGroupsService', AchievementGroupsService);

  AchievementGroupsService.$inject = ['$resource', 'helpers'];

    function AchievementGroupsService($resource, helpers) {
      var achievementGroupResource = $resource('/api/admin/quest/:questId/group', {}, {
        list: {
          method: 'GET',
          url: '/api/admin/project/:projectId/quest/:questId/group',
        },
        create: {
          method: 'POST',
          url: '/api/admin/project/:projectId/quest/:questId/group'
        },
        update: {
          method: 'PATCH',
          url: '/api/admin/project/:projectId/quest/:questId/group/:groupId'
        },
        remove: {
          method: 'DELETE',
          url: '/api/admin/project/:projectId/quest/:questId/group/:groupId'
        },
      });

      var service = {
        API: {
          list: list,
          create: create,
          get: get,
          update: update,
          remove: remove,
        }
      };

      return service;

      //------------------------ API methods ---------------------------

      function list(projectId, questId) {
        return achievementGroupResource.list({projectId: projectId, questId: questId}).$promise;
      }

      function create(projectId, questId, data) {
        return achievementGroupResource.create({projectId: projectId, questId: questId}, data).$promise;
      }

      function get(projectId, questId, groupId) {
        return achievementGroupResource.get({projectId: projectId, questId: questId, groupId: groupId}).$promise;
      }

      function update(projectId, questId, groupId, data) {
        return achievementGroupResource.update({projectId: projectId, questId: questId, groupId: groupId}, data).$promise;
      }

      function remove(projectId, questId, groupId) {
        return achievementGroupResource.remove({projectId: projectId, questId: questId, groupId: groupId}).$promise;
      }

      //--------------------- Other service methods ---------------------

    }
})();