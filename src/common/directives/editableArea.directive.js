(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('editableArea', editableArea);

    function editableArea() {
        controllerFunc.$inject = ['$scope', '$element', '$attrs', '$q', 'toastr'];

        var directive =  {
            restrict: 'A',
            scope: true,
            compile: compileFN,
            controller: controllerFunc,
            controllerAs: 'editable'
        };

        return directive;

        function compileFN(el) {
            el.find('.editable-edit-btn').attr('ng-click', 'editable.edit()').attr('ng-hide', 'editable.editFlag').attr('ng-if', '!editable.disabled');
            el.find('.editable-save-btn').attr('ng-click', 'editable.save()').attr('ng-show', 'editable.editFlag && !editable.invalid').attr('ng-if', '!editable.disabled');
            el.find('.editable-cancel-btn').attr('ng-click', 'editable.discard()').attr('ng-show', 'editable.editFlag').attr('ng-if', '!editable.disabled');
            if(el.attr("filter")){
                var filter = el.attr("filter");
                el.find('.editable-content').attr('ng-hide', 'editable.editFlag').attr('ng-bind', 'editable.model || editable.defaultPlaceholder | ' + filter);
            } else{
                el.find('.editable-content').attr('ng-hide', 'editable.editFlag').attr('ng-bind', "editable.model || editable.defaultPlaceholder");
            }
            el.find('.editable-field').attr('ng-model', 'editable.model').attr('ng-show', 'editable.editFlag').attr('ng-if', '!editable.disabled');
            el.find('.editable-error')
                .attr('ng-bind', 'error')
                .attr('ng-show', 'editable.error')
                .attr('ng-repeat', 'error in editable.error')
                .attr('ng-if', '!editable.disabled');

            return linkFunc;
        }

        function linkFunc(scope, el, attr, ctrl) {
            var defaultVal = attr.defaultPlaceholder ? attr.defaultPlaceholder : 'No data';
            scope.$watch(attr.editableArea, function(new_val){
                if(ctrl.once && angular.isDefined(new_val) && new_val !== null) {
                    ctrl.origin_val = new_val;
                    ctrl.once = false;
                }
                ctrl.model = new_val;
                ctrl.origin_val = ctrl.origin_val ? ctrl.origin_val : defaultVal;
            });

            scope.$watch(attr.disabled, function(new_val) {
                ctrl.disabled = new_val
            })
        }

        function controllerFunc($scope, $el, $attrs, $q, toastr) {
            /* jshint validthis:true */
            var directive = this;
            directive.model = null;
            directive.invalid = false;
            directive.save = save;
            directive.edit = edit;
            directive.discard = discard;
            directive.saveFn = $scope.$eval($attrs.saveFn);
            directive.onEdit = $attrs.onEdit ? $scope.$eval($attrs.onEdit) : null;
            directive.customErrors = $attrs.customErrors ? $scope.$eval($attrs.customErrors) : {};

            directive.defaultPlaceholder = $attrs.defaultPlaceholder || 'No data';
            directive.origin_val;
            directive.once = true;

            var props;

            function save() {
                var value = !directive.model && $attrs.defaultValue ?
                    $scope.$eval($attrs.defaultValue) :
                    directive.model

                var updateObj = resolveObjName($attrs.properyName, value)
                var result = directive.saveFn(updateObj, $attrs.id);
                $q.when(result).then(function(){
                    directive.editFlag = false;
                    directive.error = false;
                }, function(r){
                    directive.error = r.data.error && r.data.error.fields;

                    while(directive.error && props.length > 0){
                        directive.error = directive.error[props[0]];

                        if (directive.customErrors[directive.error])
                            directive.error = directive.customErrors[directive.error]

                        props.shift();
                    }

                    if (!angular.isObject(directive.error))
                        directive.error = [directive.error]

                    !directive.error ? toastr.error(
                        '<div>Request is failed.</div>'+
                        '<b>Reason: '+r.data.error_reason+'</b>'
                    ): false;
                });
            }

            function edit() {
                directive.editFlag = true;
                if(directive.onEdit) {
                    directive.onEdit(directive.model);
                }
                setTimeout(function() {
                    $el.find('[ng-model="editable.model"]')[0].focus();
                }, 0)
            }

            function discard() {
                directive.model = directive.origin_val;
                directive.editFlag = false;
                directive.error = false;
            }

            function resolveObjName(name, val) {
                var parts = name.split('.'),
                    obj = {},
                    temp = obj[parts[0]] = parts.length > 1 ? {} : val;
                props = parts;
                for (var i = 1; i < parts.length; i++) {
                    temp = temp[parts[i]] = ((i+1) == parts.length) ? val : {};
                };
                return obj;
            }
        }
    }
})();