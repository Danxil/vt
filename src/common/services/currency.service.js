(function() {
  'use strict';

  angular
      .module('app.services')
      .factory('CurrenciesService', CurrenciesService);

  CurrenciesService.$inject = ['$resource', 'helpers', 'session', 'auth'];

  function CurrenciesService($resource, helpers, session, auth) {
    var adminsResource = $resource('/api/admin/admin/', {}, {
      list: {
        method: 'GET',
        url: '/api/currency',
      },
      create: {
        method: 'POST',
        url: '/api/currency'
      },
      get: {
        method: 'GET',
        url: '/api/currency/:currencyId'
      },
      update: {
        method: 'PATCH',
        url: '/api/currency/:currencyId'
      },
      remove: {
        method: 'DELETE',
        url: '/api/currency/:currencyId'
      },
    });

    var service = {
      API: {
        list: list,
        create: create,
        get: get,
        update: update,
        remove: remove,

      }
    };

    return service;

    //------------------------ API methods ---------------------------

    function list(paramsPages, paramsFilter, paramsSorting) {
      var readminParams = helpers.getRequestParams(paramsPages, paramsFilter, paramsSorting);
      return adminsResource.list(readminParams).$promise;
    }

    function create(data) {
      return adminsResource.create(data).$promise;
    }

    function get(currencyId) {
      return adminsResource.get({currencyId: currencyId}).$promise;
    }

    function update(currencyId, data) {
      return adminsResource.update({currencyId: currencyId}, data).$promise;
    }

    function remove(currencyId) {
      return adminsResource.remove({currencyId: currencyId}).$promise;
    }
  }
})();