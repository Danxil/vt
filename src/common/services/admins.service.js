(function() {
  'use strict';

  angular
      .module('app.services')
      .factory('AdminsService', AdminService);

  AdminService.$inject = ['$resource', 'helpers', 'session', 'auth'];

  function AdminService($resource, helpers, session, auth) {
    var adminsResource = $resource('/api/admin/admin/', {}, {
      list: {
        method: 'GET',
        url: '/api/admin/admins/',
      },
      create: {
        method: 'POST',
        url: '/api/admin/admins/'
      },
      get: {
        method: 'GET',
        url: '/api/admin/admins/:adminId'
      },
      update: {
        method: 'PATCH',
        url: '/api/admin/admins/:adminId'
      },
      remove: {
        method: 'DELETE',
        url: '/api/admin/admins/:adminId'
      },
      updateRoles: {
        method: 'PUT',
        url: '/api/admin/project/:projectId/admins/:adminId/roles',
        isArray: true
      },
      getAdminRolesForProject: {
        method: 'GET',
        url: '/api/admin/project/:projectId/admins/:adminId/roles',
        isArray: true
      },
    });

    var service = {
      API: {
        list: list,
        create: create,
        get: get,
        update: update,
        remove: remove,
        updateRoles: updateRoles,
        getAdminRolesForProject: getAdminRolesForProject,
      },
      toggleUserRole: toggleUserRole,
      setActiveProject: setActiveProject,
      hasProjectPermission: hasProjectPermission
    };

    return service;

    var activeProjectPermissions

    //------------------------ API methods ---------------------------

    function list(paramsPages, paramsFilter, paramsSorting) {
      var readminParams = helpers.getRequestParams(paramsPages, paramsFilter, paramsSorting);
      return adminsResource.list(readminParams).$promise;
    }

    function create(data) {
      return adminsResource.create(data).$promise;
    }

    function get(adminId) {
      return adminsResource.get({adminId: adminId}).$promise;
    }

    function update(adminId, data) {
      return adminsResource.update({adminId: adminId}, data).$promise;
    }

    function remove(adminId) {
      return adminsResource.remove({adminId: adminId}).$promise;
    }

    function updateRoles(projectId, adminId, roleIds) {
      _checkIfSelfEditing(adminId);
      return adminsResource.updateRoles({projectId: projectId, adminId: adminId}, roleIds).$promise;
    }

    function getAdminRolesForProject(projectId, adminId) {
      return adminsResource.getAdminRolesForProject({projectId: projectId, adminId: adminId}).$promise;
    }

    //--------------------- Other service methods ---------------------

    function setActiveProject(projectId) {
      return adminsResource.getAdminRolesForProject({projectId: projectId, adminId: auth.getUser().id}).$promise
          .then(function(roles) {
            activeProjectPermissions = _.union.apply(this, _.map(roles, 'permissions'))
          })
    }

    function hasProjectPermission(permission) {
      return auth.getUser().is_super || activeProjectPermissions.indexOf(permission) != -1
    }

    function toggleUserRole(projectId, user, role) {
      var userRoleIds = _.map(_.where(user.roles, {project_id: parseInt(projectId)}), 'id');

      var index = userRoleIds.indexOf(role.id);

      if( index > -1 ) {
        userRoleIds.splice(index, 1);
      } else {
        userRoleIds.push(role.id)
      }

      var promise = updateRoles(projectId, user.id, userRoleIds);
      promise.then(function (data) {
        if(index > -1) {
          _.remove(user.roles, {id: role.id});
        } else {
          user.roles.push({
            id: role.id,
            role_name: role.role_name
          });
        }
      }, function (errors) {
        _.remove(role.users, {id: user.id});
      });

      return promise;
    }

    function _checkIfSelfEditing(id) {
      if(session.get('id') == id){
        auth.init();
        return true;
      }
      return false;
    }

  }
})();