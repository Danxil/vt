(function() {
  'use strict';

  angular
      .module('app.project.settings')
      .controller('DeleteCurrencyCtrl', DeleteCurrencyCtrl);

  DeleteCurrencyCtrl.$inject = [
    '$modalInstance',
    '$stateParams',
    'toastr',
    'data',
    '$q'
  ];

  function DeleteCurrencyCtrl($modalInstance,
                           $stateParams,
                           toastr,
                           data,
                           $q) {
    var vm = this;

    vm.remove = remove;
    vm.cancel = cancel;

    activate();

    function activate() {
      vm.currency = data.currency
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function remove() {
      $modalInstance.close(true);
    }
  }
})();