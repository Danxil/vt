(function() {
  'use strict';

  angular.module('app.project.roles')
    .controller('CreateRoleCtrl', CreateRoleCtrl);

    CreateRoleCtrl.$inject = ['$scope', '$q', '$modalInstance', '_', 'RolesService', '$stateParams'];

    function CreateRoleCtrl($scope, $q, $modalInstance, _, RolesService, $stateParams) {
      var vm = this;

      vm.role = {
        role_name: '',
        description: '',
        permissions: []
      };
      vm.permissions = [];
      vm.permGroups = [];

      vm.checkPermission = checkPermission;
      vm.checkGroup = checkGroup;
      vm.create = create;

      _activate();

      function _activate() {
        RolesService.API.permisionsList()
          .then(function (response) {
            vm.permissions = vm.permissions.concat(response);
            var permGroupNames = vm.permGroups.concat(_.uniq(_.map(vm.permissions, 'group')));
            _.forEach(permGroupNames, function (name) {
              vm.permGroups.push({name: name, checked: null});
            });
          });
      }

      function create() {
        vm.role.permissions = _.map(_.filter(vm.permissions, {checked: true}), 'id');
        return RolesService.API.create($stateParams.projectId, vm.role)
          .then(function (response) {
            toastr.success('Role created');
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