(function() {
  'use strict';

  angular.module('app.project.roles')
      .filter('containUser', containUser)
      .controller('RolesCtrl', RolesCtrl);

  function containUser() {
    return function(collection, userNameQuery) {
      if (angular.isUndefined(userNameQuery) || userNameQuery == '') {
        return collection;
      }
      var parts = userNameQuery.match(/(\w+)/gi);
      if (angular.isUndefined(parts) || parts.length == 0) {
        return collection;
      }
      var out = [];
      var role = null;
      var fname, lname, part = null;
      var matched = false;
      for (var i in collection) {
        role = collection[i];
        matched = false;
        for (var j in role.users) {
          fname = role.users[j].firstname.toLowerCase();
          lname = role.users[j].lastname.toLowerCase();
          for (var k in parts) {
            part = parts[k].toLowerCase();
            if (fname.indexOf(part) >= 0 || lname.indexOf(part) >= 0) {
              matched = true;
              break;
            }
          }
          if (matched) {
            out.push(role);
            break;
          }
        }
      }
      return out;
    }
  }

  RolesCtrl.$inject = ['$q', '$modal', '_', 'auth', 'RolesService', 'AdminsService', '$stateParams'];

  function RolesCtrl($q, $modal, _, auth, RolesService, AdminsService, $stateParams) {
    var vm = this;

    vm.roles = [];
    vm.users = [];
    vm.selectedRole = {};

    vm.createRoleModal = createRoleModal;
    vm.editRoleModal = editRoleModal;
    vm.toggleUserRole = toggleUserRole;
    vm.removeRoleFromUsers = removeRoleFromUsers;
    vm.deleteRole = deleteRole;

    _activate();

    function _activate() {
      var promisses = [RolesService.API.list($stateParams.projectId)];
      if (auth.getUser().is_super) {
        promisses.push(AdminsService.API.list());
      }
      $q.all(promisses)
          .then(function(responses) {
            vm.roles = responses[0];
            if (responses.length == 2) {
              vm.users = responses[1].results;
              _.forEach(vm.roles, function(role) {
                role.users = vm.users.filter(function(user) {
                  return !!_.find(user.roles, {id: role.id});
                });
              });
            }
          });
    }

    function createRoleModal() {
      $modal.open({
        templateUrl: 'app/project/roles/create-role.tpl.html',
        controller: 'CreateRoleCtrl',
        controllerAs: 'vm'
      }).result.then(function(response) {
            _activate();
          });
    }

    function editRoleModal(role) {
      $modal.open({
        templateUrl: 'app/project/roles/edit-role.tpl.html',
        controller: 'EditRoleCtrl',
        controllerAs: 'vm',
        resolve: {
          editableRole: function() {
            return angular.copy(role);
          }
        }
      }).result.then(function(response) {
            _activate();
          });
    }

    function toggleUserRole(user, role) {
      AdminsService.toggleUserRole($stateParams.projectId, user, role)
          .then(function(response) {
            user.roles = response
            toastr.success('User roles updated successfuly!');
          }, _errorsHandler);
    }

    function deleteRole(role) {
      if (role.users.length) {
        removeRoleFromUsers(role)
            .then(function() {
              _delete(role);
            });
      } else {
        _delete(role);
      }
    }

    function removeRoleFromUsers(role) {
      var promisses = [];
      _.forEach(role.users, function(user) {
        promisses.push(AdminsService.toggleUserRole($stateParams.projectId, user, role))
      })

      return $q.all(promisses).then(function(responses) {
        _activate();
      }, _errorsHandler);
    }

    function _delete(role) {
      RolesService.API.delete($stateParams.projectId, role.id)
          .then(function(response) {
            toastr.success('Role deleted successfuly!');
            _activate();
          });
    }

    function _errorsHandler(errors) {
      if (angular.isArray(errors)) {
        for (var i = 0, l = errors.length; i < l; i++) {
          toastr.error('Error ' + errors[i].status + ': ' + errors[i].data.error_reason);
        }
      } else {
        toastr.error('Error ' + errors.status + ': ' + errors.data.error_reason);
      }
    }

  };

})();
