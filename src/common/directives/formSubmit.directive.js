(function() {
  'use strict';

  angular
      .module('app.directives')
      .directive('formSubmit', ['$parse', function($parse) {
        return {
          scope: true,
          restrict: 'A',
          link: function(scope, element, attrs) {
            var CLIENT_ERRORS = [
              'pattern',
              'required',
              'min',
              'max',
              'number',
            ]

            var formName = attrs.name;
            var form = $parse(formName)(scope)
            var submit_fn = $parse(attrs['formSubmit']);
            scope.is_loading = false;

            function checkClientValidity() {
              var success = true

              _.each(form.$error, function(error, key) {
                if (CLIENT_ERRORS.indexOf(key) != -1)
                  return success = false
              })

              return success
            }

            // mark all fields as valid
            function clearValidity() {
              element.find('.alert').remove();
              angular.forEach(form.$error, function(fields, error) {
                while (fields.length) {
                  var key = fields[0]
                  form[key.$name].$setValidity(error, true);
                };
              });
            }

            function setDeepFieldsError(value, fieldPart) {
              if (angular.isObject(value)) {
                angular.forEach(value, function(value, newFieldPart) {
                  setDeepFieldsError(value, fieldPart + '-' + newFieldPart);
                })
              }
              else {
                form[fieldPart].$setValidity(value, false);
              }
            }

            // error handler function
            function errorHandler(response) {
              if (!response.data) {
                return;
              } else {
                if (!response.data.error && !response.data.error_reason) {
                  return;
                } else {
                  if (response.data.error.fields) {
                    angular.forEach(response.data.error.fields, function(value, key) {
                      setDeepFieldsError(value, key);
                    });
                  } else {
                    element.prepend('<div class="alert alert-danger">' + response.data.error_reason + '</div>')
                  }
                }
              }
            }

            $(element).on('submit', function(e) {
              scope.is_loading = true;

              if (!checkClientValidity()) return

              clearValidity();
              submit_fn(scope, {$event: e}).then(function(response) {
                // if previous .then() didn't return $q.reject or Error
                // success callback will be called.
                clearValidity();
                if (angular.isDefined(response) && angular.isDefined(response.status) && response.status == 400) {
                  errorHandler(response)
                }
              }, errorHandler).finally(function() {
                scope.is_loading = false;
              });
            });
          }
        }
      }]);
})();
