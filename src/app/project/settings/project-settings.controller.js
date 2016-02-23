(function() {
  'use strict';

  angular
    .module('app.project.settings')
    .controller('ProjectSettingsCtrl', ProjectSettingsCtrl);

  ProjectSettingsCtrl.$inject = [
    'data',
    '$stateParams',
    'ProjectsService',
    '$modal',
    '$q',
    '$scope',
    'toastr',
    '$state'
  ];

  function ProjectSettingsCtrl(data,
                               $stateParams,
                               ProjectsService,
                               $modal,
                               $q,
                               $scope,
                               toastr,
                               $state) {
    var vm = this;

    vm.save = save
    vm.deleteProject = deleteProject
    vm.removeCurrency = removeCurrency
    vm.invalidCurrency = invalidCurrency

    _activate();

    function _activate() {
      vm.project = _prepareGetProjectData(data.project)
      vm.usingCurrencies = data.usingCurrencies
    }

    function _preparePostPropertyObj(propertyObj) {
      propertyObj = _.cloneDeep(propertyObj)

      if (propertyObj.currencies)
        propertyObj.currencies = _.map(propertyObj.currencies, function(currency) {
          return currency.text
        })

      return propertyObj
    }

    function _prepareGetProjectData(data) {
      data = _.cloneDeep(data)

      data.currencies = _.map(data.currencies, function(currency) {
        return {text: currency}
      })

      return data
    }

    function save(propertyObj) {
      propertyObj = _preparePostPropertyObj(propertyObj)

      return ProjectsService.API.update($stateParams.projectId, propertyObj)
        .then(function(response) {
          _.assign(data.project, response);

          _activate()
        }
      );
    }

    function deleteProject() {
      $modal.open({
        templateUrl: 'app/project/settings/delete-project.tpl.html',
        controller: 'DeleteProjectCtrl',
        controllerAs: 'vm',
        resolve: {
          data: function() {
            return {
              project: vm.project
            }
          }
        }
      }).result.then(function(result) {
          $state.go('app.projects')
        });
    }

    function removeCurrency(currency) {
      if (~vm.usingCurrencies.indexOf(currency.text)) {
        toastr.error('This currensy using now')
        
        return false
      }

      $modal.open({
        templateUrl: 'app/project/settings/delete-currency.tpl.html',
        controller: 'DeleteCurrencyCtrl',
        controllerAs: 'vm',
        resolve: {
          data: function() {
            return {
              currency: currency
            }
          }
        }
      }).result.then(function(result) {
          if (result)
            vm.project.currencies = _.without(vm.project.currencies, currency)

          vm.save({currencies: vm.project.currencies})
        });

      return false
    }

    function invalidCurrency() {
      toastr.error('This currency already exist')
    }
  }
})();