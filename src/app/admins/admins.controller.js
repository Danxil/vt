(function() {
  'use strict';

  angular
      .module('app.admins')
      .controller('AdminsCtrl', AdminsCtrl);

  AdminsCtrl.$inject = [
    '$q',
    '$state',
    '$modal',
    'ngTableParams',
    'toastr',
    '_',
    'AdminsService'
  ];

  function AdminsCtrl($q, $state, $modal, NgTableParams, toastr, _, AdminsService) {
    var vm = this;

    vm.$state = $state;
    vm.selectedAdmins = [];
    vm.tableParams = {};
    vm.createNewAdmin = createNewAdmin;
    vm.deleteAdmins = deleteAdmins;
    vm.editAdmin = editAdmin;

    activate();

    function activate() {
      vm.tableParams = initTableParams();
    }

    function initTableParams() {
      return new NgTableParams({
        page: 1,
        count: 10
      }, {
        total: 0,
        getData: function($defer, params) {
          AdminsService.API.list(params.url(), params.filter(), params.sorting())
              .then(function(data) {
                if (_.isEmpty(params.filter())) {
                  vm.total = data.total;
                }
                params.total(vm.totalFiltered = data.total);
                $defer.resolve(vm.admins = data.results);

                _.forEach(vm.admins, function(admin) {
                  admin.projects = _.uniq(admin.roles, 'project_id').length;
                });
              });
        }
      });
    }

    function createNewAdmin() {
      $modal.open({
        templateUrl: 'app/admins/admin.tpl.html',
        controller: 'AdminCtrl',
        controllerAs: 'vm',
        resolve: {
          adminId: function() {
            return false;
          },
        }
      }).result.then(function(response) {
            vm.tableParams.reload();
            toastr.success('Admin created');
          });
    }

    function editAdmin(adminId) {
      /*
       if(!vm.permissions.admin_view){
       $state.go('app.homepage');
       }
       */
      $modal.open({
        templateUrl: 'app/admins/admin.tpl.html',
        controller: 'AdminCtrl',
        controllerAs: 'vm',
        resolve: {
          adminId: function() {
            return adminId;
          },
        }
      }).result.then(
          function(response) {
            if (response.adminSaved) {
              vm.tableParams.reload();
              toastr.success('Admin edited successfully!');
            }
          });
    }

    function deleteAdmins(ids) {
      var prom = [];
      for (var i = 0, l = ids.length; i < l; i++) {
        prom.push(AdminsService.API.remove(ids[i]));
      }
      $q.all(prom).then(
          function(response) {
            toastr.success('Admins deleted');
            vm.tableParams.reload();
          },
          function(errors) {
            toastr.error('Admins not deleted');
          }).then(function() {
            vm.selectedAdmins = [];
          });
    }

  }
})();