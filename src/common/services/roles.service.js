(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('RolesService', RolesService);

    RolesService.$inject = ['$resource', '$q', '_'];

    function RolesService($resource, $q, _) {
      var rolesResource = $resource('/api/admin/', {}, {
        permisionsList: {
          method: 'GET',
          url: '/api/admin/permissions',
          isArray: true
        },
        list: {
          method: 'GET',
          url: '/api/admin/project/:projectId/roles/',
          isArray: true
        },
        create: {
          method: 'POST',
          url: '/api/admin/project/:projectId/roles/'
        },
        get: {
          method: 'GET',
          url: '/api/admin/project/:projectId/roles/:roleId'
        },
        update: {
          method: 'PATCH',
          url: '/api/admin/project/:projectId/roles/:roleId'
        },
        delete: {
          method: 'DELETE',
          url: '/api/admin/project/:projectId/roles/:roleId'
        },
      });

      var service = {
        API: {
          permisionsList: permisionsList,
          list: list,
          create: create,
          get: get,
          update: update,
          'delete': deleteRole,
        }
      };

      return service;

      //------------------------ API methods ---------------------------

      function permisionsList(params) {
        return rolesResource.permisionsList().$promise;
      }

      function list(projectId, params){
        return rolesResource.list({projectId: projectId}, params).$promise;
      }

      function create(projectId, role) {
        return rolesResource.create({projectId: projectId}, role).$promise;
      }

      function get(projectId, roleId) {
        return rolesResource.get({projectId: projectId, roleId: roleId}).$promise;
      }

      function update(projectId, roleId, role) {
        return rolesResource.update({projectId: projectId, roleId: roleId}, role).$promise;
      }

      function deleteRole(projectId, roleId) {
        return rolesResource.delete({projectId: projectId, roleId: roleId}).$promise;
      }

      //--------------------- Other service methods ---------------------

    }
})();