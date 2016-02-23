(function() {
  'use strict';

  angular
      .module('app.admins')
      .controller('AdminCtrl', AdminCtrl);

  AdminCtrl.$inject = ['$q',
    '$scope',
    '$stateParams',
    '$modalInstance',
    'AdminsService',
    'ProjectsService',
    'RolesService',
    'adminId',
    'auth',
  ];

  function AdminCtrl($q, $scope, $stateParams, $modalInstance, AdminsService, ProjectsService, RolesService, adminId, auth) {
    var vm = this;

    vm.modalTitle = "";
    vm.roles = [];
    vm.admin = {};
    vm.tabs = [
      {id: 'simple', label: 'Simple mode', state: true},
      {id: 'advanced', label: 'Advanced mode', state: false}
    ];

    //***** for advanced mode adding roles
    vm.advancedRoles = {};
    vm.showPanel = false;

    vm.toggleAddingPanel = toggleAddingPanel;
    vm.addNewProjectRoles = addNewProjectRoles;

    vm.cancel = cancel;
    vm.groupByProject = groupByProject;
    vm.changeMode = changeMode;
    vm.swichRole = swichRole;
    vm.deleteProjectRoles = deleteProjectRoles;

    activate();

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function changeMode(tab) {
      angular.forEach(vm.tabs, function(item) {
        item.state = false;
      });
      tab.state = true;
      // for reset adding panel
      vm.newProject = {};
      vm.showPanel = false;
    }

    function groupByProject(item) {
      return item.project_name;
    }

    //************ on modal load functions ******
    function activate() {
      if (adminId) {
        AdminsService.API.get(adminId)
            .then(function(response) {
              vm.admin = response;
              vm.admin.isAmI = adminId === auth.getUser().id;
              getProjectsList();
            });

        vm.updateAdmin = updateAdmin;
        vm.modalTitle = 'Edit Admin';
      } else {
        vm.admin = {disabled: true, roles: []};
        vm.updateAdmin = createNewAdmin;
        vm.modalTitle = 'Create New Admin';
        getProjectsList();
      }
    }

    function getProjectsList() {
      ProjectsService.API.list()
          .then(function(response) {
            vm.projects = response.results;
            vm.posibleProjects = response.results;
            getRoles();
          });
    }

    function getRoles() {
      var allRolesPromises = [];

      vm.projects.forEach(function(project) {
        allRolesPromises.push(RolesService.API.list(project.id).then(function(roles) {
          roles.forEach(function(role) {
            role.project_name = project.name
          })
          return roles
        }));
      });

      $q.all(allRolesPromises).then(function(results) {
        for (var i = 0, l = vm.projects.length; i < l; i++) {
          _.forEach(results[i], function(role) {
            role.checked = false;
            vm.roles.push(role);
          });
        }

        var rolesId = _.map(vm.admin.roles, 'id');
        vm.admin.roles = [];

        _.forEach(rolesId, function(id) {
          var role = _.find(vm.roles, {id: id});
          if (role) {
            vm.admin.roles.push(role);
          }
        });
      });
    }

    //*******************************************
    //******* Role manipulation functions *******
    function swichRole(role) {
      var findedRole = _.find(vm.admin.roles, {id: role.id});
      if (findedRole) {
        _.remove(vm.admin.roles, {id: role.id});
      } else {
        vm.admin.roles.push(role);
      }
    }

    function deleteProjectRoles(projectId) {
      _.remove(vm.admin.roles, {project_id: projectId});
    }

    function toggleAddingPanel() {
      if (vm.posibleProjects.length && !vm.showPanel) {
        vm.showPanel = true;
      } else if (vm.posibleProjects.length && vm.showPanel) {
        vm.newProject.roles.forEach(function(role) {
          role.checked = false
        })

        vm.showPanel = false;
        vm.newProject = {};
      }
    }

    function addNewProjectRoles() {
      _.forEach(vm.newProject.roles, function(role) {
        if (role.checked) {
          vm.admin.roles.push(role);
        }
      });
      toggleAddingPanel();
      return false;
    }

    //*******************************************
    //************** on save changes ************
    function createNewAdmin() {
      var tmpAdminRoles = [].concat(vm.admin.roles);
      delete vm.admin.roles;
      return AdminsService.API.create(vm.admin).then(
          function(response) {
            vm.admin = response;

            vm.admin.roles = tmpAdminRoles;

            updateRolesRequest();
            return $modalInstance.close(response.toJSON());
          }, function(errors) {
            vm.admin.roles = tmpAdminRoles;
            return errors;
          });
    }

    function updateAdmin() {
      var newAdminData = {};
      for (var key in {
        'disabled': '',
        'login': '',
        'firstname': '',
        'lastname': '',
        'passwd': '',
        'newpass': ''
      }) {
        angular.isDefined(vm.admin[key]) && vm.admin[key] !== '' ? newAdminData[key] = vm.admin[key] : false;
      }

      if ((!!(vm.admin.newpass) || !!(vm.admin.newpass2)) && vm.admin.newpass != vm.admin.newpass2) {
        return $q.reject({data: {error: {fields: {newpass2: 'Passwords are not match'}}}});
      }

      return AdminsService.API.update(vm.admin.id, newAdminData).then(
          function(response) {
            updateRolesRequest();
            return response;
          }, function(errors) {
            return errors;
          });
    }

    function updateRolesRequest() {
      var reqPromises = [];
      var projIds = _.map(_.uniq(vm.admin.roles, 'project_id'), 'project_id');
      var rolesInProjects = [];
      _.forEach(vm.projects, function(project) {
        var projRoles = _.map(_.filter(vm.admin.roles, {project_id: project.id}), 'id') || [];
        rolesInProjects.push({id: project.id, rolesId: projRoles});
      });
      _.forEach(rolesInProjects, function(project) {
        reqPromises.push(AdminsService.API.updateRoles(project.id, vm.admin.id, project.rolesId));
      });
      $q.all(reqPromises).then(function(results) {
        for (var i = 0, l = results.length; i < l; i++) {
          $modalInstance.close({adminSaved: true});
        }
      });
    }

    $scope.$watchCollection('vm.admin.roles', function(newCollection) {
      if (!vm.admin || !vm.roles.length) return;

      vm.advancedRoles = {};
      vm.posibleProjects = [].concat(vm.projects);
      var projIds = _.map(_.uniq(newCollection, 'project_id'), 'project_id');
      _.forEach(vm.roles, function(role) {
        role.checked = false;
      });
      _.forEach(newCollection, function(role) {
        _.find(vm.roles, {id: role.id}).checked = true;
      });
      _.forEach(projIds, function(id) {
        vm.advancedRoles[_.find(vm.projects, {id: id}).name] = _.filter(vm.roles, {project_id: id});
        _.remove(vm.posibleProjects, {id: id});
      });
    });

    $scope.$watch('vm.newProject', function(newProject) {
      if (newProject)
        newProject.roles = _.filter(vm.roles, {project_id: newProject.id});
    });

  }
})();