(function() {
  'use strict';

  angular
    .module('app.services')
    .factory('ProjectsService', ProjectService);

  ProjectService.$inject = ['$resource'];

  function ProjectService($resource) {
    var projectsResource = $resource('/api/admin/project', {}, {
      list: {
        method: 'GET',
        url: '/api/admin/project',
      },
      create: {
        method: 'POST',
        url: '/api/admin/project'
      },
      get: {
        method: 'GET',
        url: '/api/admin/project/:projectId'
      },
      update: {
        method: 'PATCH',
        url: '/api/admin/project/:projectId'
      },
      remove: {
        method: 'DELETE',
        url: '/api/admin/project/:projectId'
      },
      getQuestTimezones: {
        method: 'GET',
        url: '/api/admin/project/:projectId/quest-timezones',
        isArray: true
      }
    });

    var service = {
      API: {
        list: list,
        create: create,
        get: get,
        update: update,
        remove: remove,
        getQuestTimezones: getQuestTimezones
      }
    };

    return service;

    //------------------------ API methods ---------------------------

    function list() {
      return projectsResource.list().$promise;
    }

    function create(data) {
      return projectsResource.create(data).$promise;
    }

    function get(projectId) {
      return projectsResource.get({projectId: projectId}).$promise;
    }

    function update(projectId, data) {
      return projectsResource.update({projectId: projectId}, data).$promise;
    }

    function remove(projectId) {
      return projectsResource.remove({projectId: projectId}).$promise;
    }

    function getQuestTimezones(projectId) {
      return projectsResource.getQuestTimezones({projectId: projectId}).$promise;
    }

    //--------------------- Other service methods ---------------------

  }
})();