(function() {
  'use strict';

  angular.module('app.project.roles')
    .controller('EditRoleCtrl', EditRoleCtrl);

    EditRoleCtrl.$inject = ['$scope', '$q', '$modalInstance', '_', 'RolesService', 'editableRole', '$stateParams'];

    function EditRoleCtrl($scope, $q, $modalInstance, _, RolesService, editableRole, $stateParams) {
      var vm = this;

      vm.role = {
        id: editableRole.id,
        role_name: editableRole.role_name,
        description: editableRole.description,
        permissions: editableRole.permissions
      };
      vm.permissions = [];
      vm.permGroups = [];

      vm.checkPermission = checkPermission;
      vm.checkGroup = checkGroup;
      vm.save = save;

      _activate();

      function _activate() {
        //get all permissions list
        RolesService.API.permisionsList() 
          .then(function (response) {
            vm.permissions = vm.permissions.concat(response);
            //form permissions groups
            var permGroupNames = vm.permGroups.concat(_.uniq(_.map(vm.permissions, 'group'))); 
            _.forEach(permGroupNames, function (name) {
              vm.permGroups.push({name: name, checked: null});
            });
            //in permissions list check permissions that role has
            _.forEach(vm.role.permissions, function (permId) {
              var permission = _.find(vm.permissions, {id: permId});
              permission.checked = true;
              checkPermission(permission);
            })
          });
      }

      function save() {
        vm.role.permissions = _.map(_.filter(vm.permissions, {checked: true}), 'id');
        return RolesService.API.update($stateParams.projectId, vm.role.id, _.omit(vm.role, 'id'))
          .then(function (response) {
            toastr.success('Role edited');
            $modalInstance.close({});
          });
      }

      function checkPermission(permission) {
        var group = _.find(vm.permGroups, {name: permission.group});
        var total = _.filter(vm.permissions, {group: permission.group}).length;
        var checked = _.filter(vm.permissions, {group: permission.group, checked: true}).length;
        var unchecked = total - checked;

        if ((unchecked === 0) || (checked === 0)) {
          group.checked = (checked === total);
        } 
        group.indeterminate = (checked !== total && unchecked !== total);
      }

      function checkGroup(group) {
        var groupPermissions = _.filter(vm.permissions, {group: group.name});
        _.forEach(groupPermissions, function (perm) {
          perm.checked = group.checked;
        })
        group.indeterminate = false;
      }

    };

})();