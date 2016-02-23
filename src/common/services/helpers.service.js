(function () {
  'use strict';

  angular
    .module('app.services')
    .factory('helpers', helpers);

  helpers.$inject = ['$rootScope', 'toastr', '$q', '$compile', '$templateCache'];

  function helpers($rootScope, toastr, $q, $compile, $templateCache) {
    var service = {
      resetBlankValues: resetBlankValues,
      getRequestParams: getRequestParams,
      successRequestMsgHandler: successRequestMsgHandler,
      errorRequestMsgHandler: errorRequestMsgHandler,
      precompileDecorator: precompileDecorator
    };


    return service;

    function resetBlankValues(obj) {
      if(!angular.isObject(obj)){
        return obj;
      } else {
        for(var key in obj){
          if(obj[key] === '' || obj[key] === undefined){
            obj[key] = null;
          }
        }
        return obj;
      }
    }

    function getRequestParams(paramsPages, paramsFilter, paramsSorting) {

      var requestParams = {
        json_body: {}
      };

      if(angular.isDefined(paramsFilter) && angular.isObject(paramsFilter) && !isEmpty(paramsFilter)) {
        requestParams.json_body.filter = {};
        for(var key in paramsFilter){
          if(paramsFilter[key] !== "" && paramsFilter[key] !== null){
            requestParams.json_body.filter[key] = paramsFilter[key];
          }
        }
      }

      if(angular.isDefined(paramsSorting) && angular.isObject(paramsSorting) && !isEmpty(paramsSorting)) {
        requestParams.json_body.sort = [];
        angular.forEach(paramsSorting, function(val, key){
          var param = [key, (val == 'asc' ? 1 : -1)]
          requestParams.json_body.sort.push(param)
        })
      }

      if (angular.isDefined(paramsPages) && angular.isObject(paramsPages) && !isEmpty(paramsPages)) {
        requestParams.json_body.limit = paramsPages.count;
        requestParams.json_body.offset = paramsPages.count * (paramsPages.page - 1);
      }

      return requestParams;
    }

    function isEmpty(obj) {

      if (obj == null) return true;
      if (obj.length > 0)    return false;
      if (obj.length === 0)  return true;

      for (var key in obj) {
        return false;
      }

      return true;
    }

    function successRequestMsgHandler(){
      toastr.success(
        '<div>Request is completed.</div>'
      );
    }

    function errorRequestMsgHandler(r){
      toastr.error(
        '<div>Request was failed.</div>'+
        '<b>Reason: '+r.data.error_reason+'</b>'
      );
    }

    function precompileDecorator(src) {
      var defer = $q.defer();
      var tpl = $templateCache.get(src);
      if (!tpl) {
        defer.reject(src + ' file was not found in $templateCache')
      } else {
        $compile(angular.element(tpl));
        defer.resolve()
      }
      return defer.promise;
    }
  }
})();
