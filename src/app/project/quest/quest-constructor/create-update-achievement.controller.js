(function() {
  'use strict';

  angular
      .module('app.project.quest.quest-constructor')
      .controller('CreateUpdateAchievementCtrl', CreateUpdateAchievementCtrl);

  CreateUpdateAchievementCtrl.$inject = [
    'AchievementsService',
    'ProjectsService',
    '$modalInstance',
    '$stateParams',
    'toastr',
    '$q',
    'LOGIC_OPERATORS',
    'DEFAULT_HINTS',
    'VALUE_TYPES',
    '$scope',
    'data',
    'FileUploader',
    'session',
    '$timeout',
  ];

  function CreateUpdateAchievementCtrl(AchievementsService,
                                       ProjectsService,
                                       $modalInstance,
                                       $stateParams,
                                       toastr,
                                       $q,
                                       LOGIC_OPERATORS,
                                       DEFAULT_HINTS,
                                       VALUE_TYPES,
                                       $scope,
                                       data,
                                       FileUploader,
                                       session,
                                       $timeout) {
    var vm = this;

    vm.submit = submit;
    vm.cancel = cancel;
    vm.activateCreateFromExistMode = activateCreateFromExistMode;
    vm.deactivateCreateFromExistMode = deactivateCreateFromExistMode;
    vm.addCondition = addCondition;
    vm.removeCondition = removeCondition;
    vm.addEvent = addEvent;
    vm.removeEvent = removeEvent;
    vm.addMetric = addMetric;
    vm.removeMetric = removeMetric;
    vm.addMetricCondition = addMetricCondition;
    vm.removeMetricCondition = removeMetricCondition;
    vm.toggleMetricConditioned = toggleMetricConditioned;
    vm.removeImage = removeImage;
    vm.addReward = addReward;
    vm.removeReward = removeReward;
    vm.testSubmit = testSubmit;
    vm.createFromExistSubmit = createFromExistSubmit;
    vm.groupByAchievements = groupByAchievements;
    vm.createNewCurrency = createNewCurrency;

    activate();

    function activate() {
      vm.viewMode = !$scope.hasProjectPermission('achievement_edit') || $scope.quest.status == 'enabled'

      vm.LOGIC_OPERATORS = LOGIC_OPERATORS;
      vm.VALUE_TYPES = VALUE_TYPES;
      vm.JSONValueRegExp = '"([^"\\\\]*|\\\\["\\\\bfnrt\/]|\\\\u[0-9a-f]{4})*"$|^[+-]?[0-9]+$|^[0-9]+\\.[0-9]+$|^true$|^false$|^null$'

      vm.customJSONErrors = {
        pattern: 'Incorrect field (only format of JSON value)',
        required: 'This field is required'
      }
      vm.customJSONMetricConditionErrors = {
        pattern: 'Incorrect field (only format of JSON value or metric name or field name)',
        required: 'This field is required'
      }
      vm.customGeneralErrors = {
        required: 'This field is required'
      }
      vm.customFormulaErrors = {
        required: 'This field is required',
        'expression syntax error': 'Syntax error. Use as example: A + B - (C / D) * E',
        'undefined variables': 'Undefined variables. As variables, you must use only: metric names, event fields'
      }

      vm.codemirrorFormulaOptions = {
        theme: 'eclipse',
        mode: 'python',
        matchBrackets: true,
        readOnly: vm.viewMode ? 'nocursor' : false,
        autoCloseBrackets: true,
        onLoad: function(editor) {
          editor.on("beforeChange", function(instance, change) {
            var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
            change.update(change.from, change.to, [newtext]);

            return true;
          });
        },
        placeholder: 'Code goes here...',
      };

      vm.codemirrorTestInputOptions = {
        theme: 'eclipse',
        mode: 'python',
        matchBrackets: true,
        autoCloseBrackets: true,
        onLoad: function(editor) {

        },
        placeholder: 'Code goes here...',
      };

      vm.codemirrorTestResultOptions = {
        theme: 'eclipse',
        mode: 'python',
        matchBrackets: true,
        readOnly: 'nocursor',
        autoCloseBrackets: true,
        onLoad: function(editor) {

        },
        placeholder: '',
      };

      vm.uploader = new FileUploader({
        alias: 'image',
        headers: {
          'Authorization': session.get('token')
        }
      });

      vm.uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      });

      vm.sortableOptions = {
        cancel: 'input,textarea,button,select,option,.CodeMirror,.unsortable',
        cursor: 'move',
        tolerance: 'pointer',
      }

      data = data || {}

      vm.formulaVariables = []
      vm.formulaVariablesHints = []

      vm.action = data.achievement ? 'update' : 'create';

      if (vm.action == 'create')
        vm.quests = data.questsResponse.results

      vm.project = data.project || {};
      vm.groups = _.cloneDeep(data.groups) || [];
      vm.achievements = _.cloneDeep(data.achievements) || [];
      vm.achievement = _.cloneDeep(data.achievement) || data.defaultAchievement || {};
      vm.logic = data.logicResponse ?
          _prepareGetLogicData(data.logicResponse) :
      {
        conditions: [],
        events: [],
        metrics: [],
        money_rewards: [],
        progress: {},
        depends_on: []
      };

      vm.testData = {
        verbosity: 1,
        events: ''
      }

      $scope.$watch(
          'vm.logic.events',
          _formulaVariablesChanged.bind(this, 'events', 'field'),
          true
      )
      $scope.$watch(
          'vm.logic.metrics',
          _formulaVariablesChanged.bind(this, 'metrics', 'metric_name'),
          true
      )

      _setReindexWatchers()

      vm.logic.removeProps = {}
    };

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function activateCreateFromExistMode() {
      vm.selectedQuestWatcher = $scope.$watch('vm.selectedQuest', _getQuestAchievements)

      vm.createFromExistMode = true
    }

    function deactivateCreateFromExistMode() {
      vm.selectedQuestWatcher()

      vm.selectedAchievement = null
      vm.questAchievements = null
      vm.selectedQuest = null

      vm.createFromExistMode = false
    }

    function createFromExistSubmit() {
      if ($scope.hasProjectPermission('achievement_logic'))
        var logicPromise = AchievementsService.API
          .getLogic($stateParams.projectId, vm.selectedAchievement.id)

      delete vm.selectedAchievement.id
      delete vm.selectedAchievement.image_path

      return $q.when(logicPromise).then(function(logicResponse) {
        if (vm.selectedQuest.id != $stateParams.questId)
          delete logicResponse.depends_on

        vm.selectedAchievement.group_id = vm.achievement.group_id
        vm.achievement = _.cloneDeep(vm.selectedAchievement)
        vm.logic = logicResponse ? _prepareGetLogicData(logicResponse.toJSON()) : vm.logic

        deactivateCreateFromExistMode()
      })
    }

    function _setReindexWatchers() {
      $scope.$watch('vm.logic.events', _reindexMetricsEvents, true)
      $scope.$watch('vm.logic.metrics', _reindexConditionsMetrics, true)
      $scope.$watch('vm.logic.metrics', _reindexProgressMetrics, true)
      $scope.$watch('vm.formulaVariables', _reindexFormulaConditions, true)
    }

    function _getQuestAchievements(quest) {
      if (!quest) return

      AchievementsService.API.list($stateParams.projectId, {quest_id: quest.id})
        .then(function(response) {
          vm.questAchievements = response.results
        })
    }

    function _reindexMetricsEvents(newVal, oldVal) {
      vm.logic.metrics.forEach(function(metric) {
        if (!metric.event_type) return

        var oldEvent = _.find(oldVal, function(event) {
          return  event._id == metric.event_type._id
        })

        if (oldEvent)
          var newEvent = _.find(newVal, function(event) {
            return event.event_type == oldEvent.event_type
          })

        if (!newEvent)
          newEvent = _.find(newVal, function(event) {
            return event.event_type == metric.event_type.event_type
          })

        metric.event_type = newEvent
      })
    }

    function _reindexConditionsMetrics(newVal, oldVal) {
      vm.logic.conditions.forEach(function(condition) {
        if (!condition.metric) return

        var oldMetric = _.find(oldVal, function(metric) {
          return metric._id == condition.metric._id
        })

        if (oldMetric)
          var newMetric = _.find(newVal, function(metric) {
            return metric.metric_name == oldMetric.metric_name
          })

        if (!newMetric)
          newMetric = _.find(newVal, function(metric) {
            return metric.metric_name == condition.metric.metric_name
          })

        condition.metric = newMetric
      })
    }

    function _reindexProgressMetrics(newVal, oldVal) {
      if (!vm.logic.progress.metric) return

      var oldMetric = _.find(oldVal, function(metric) {
        return metric._id == vm.logic.progress.metric._id
      })

      if (oldMetric)
        var newMetric = _.find(newVal, function(metric) {
          return metric.metric_name == oldMetric.metric_name
        })

      if (!newMetric)
        newMetric = _.find(newVal, function(metric) {
          return metric.metric_name == vm.logic.progress.metric.metric_name
        })

      vm.logic.progress.metric = newMetric
    }

    function _reindexFormulaConditions(newVal, oldVal) {
      vm.logic.metrics.forEach(function(metric) {
        if (!metric.condition || typeof metric.condition != 'object') return

        metric.condition.forEach(function(condition) {
          if (!condition.metric) return

          var oldConditionMetric = _.find(oldVal, {
            _id: condition.metric._id,
          })

          var newConditionMetric = condition.metric

          var newVariable = _.find(newVal, function(formulaVariable) {
            return formulaVariable.collection == oldConditionMetric.collection &&
                formulaVariable.value == oldConditionMetric.value
          })


          if (!newVariable)
            var newVariable = _.find(newVal, function(formulaVariable) {
              return formulaVariable.collection == newConditionMetric.collection &&
                  formulaVariable.value == newConditionMetric.value
            })

          condition.metric = newVariable
        })
      })
    }

    function _formulaVariablesChanged(collection, field, newVal, oldVal) {
      var arr = []

      newVal.forEach(function(item) {
        arr.push({
          field: field,
          collection: collection,
          value: item[field],
          _id: item._id
        })
      })

      if (oldVal.length > newVal.length)
        vm.formulaVariables.splice(-1, oldVal.length - newVal.length)

      vm.formulaVariables.forEach(function(formulaVariable) {
        var arrIndex = _.findIndex(arr, function(item) {
          return formulaVariable._id == item._id
        })

        if (~arrIndex) {
          formulaVariable.value = arr[arrIndex].value
          arr.splice(arrIndex, 1)
        }
      })

      vm.formulaVariables = _.union(vm.formulaVariables, arr)

      var hints = _.map(vm.formulaVariables, function(item) {
        return item.value
      })

      vm.formulaVariablesHints = _.union(DEFAULT_HINTS, hints)

      var metricsRegExp = '|' + _.map(vm.formulaVariablesHints, function(item) {
            return '^' + item + '$'
          }).join('|')

      vm.JSONAndMetricsValueRegExp = vm.JSONValueRegExp + metricsRegExp
    }

    function _prepareGetLogicData(data) {
      var data = _.cloneDeep(data)

      data.removeProps = {}

      data.money_rewards = _.pairs(data.money_rewards)

      data.money_rewards = _.map(data.money_rewards, function(reward, index) {
        return {
          currency: reward[0],
          value: reward[1]
        }
      })

      data.events.forEach(function(event) {
        event._id = Math.random()
      })

      data.metrics.forEach(function(metric) {
        metric._id = Math.random()
        metric.event_type = _.find(data.events, {event_type: metric.event_type})

        if (!metric.condition)
          var conditions = []
        else
          conditions = metric.condition.split(' and ')

        //next tick
        $timeout(function() {
          metric.condition = []

          conditions.forEach(function(condition) {
            condition = condition.split(' ')

            var variable = condition[0]
            var target = _.find(data.events, {field: variable}) ||
                _.find(data.metrics, {metric_name: variable})

            var variable = _.find(vm.formulaVariables, function(formulaVariable) {
              return formulaVariable._id == target._id
            })

            metric.condition.push({
              metric: variable,
              op: condition[1],
              value: condition[2]
            })
          })
        })
      })

      data.conditions.forEach(function(condition) {
        condition.metric = _.find(data.metrics, function(item) {
          return item.metric_name == condition.metric
        })
      })

      if (data.progress.metric !== undefined && data.progress.metric !== null)
        data.progress.metric = _.find(data.metrics, function(metric) {
          return metric.metric_name == data.progress.metric
        })

      return data
    }

    function _prepareSubmitLogicData(data) {
      var data = _.cloneDeep(data)

      _.each(data.removeProps, function(prop, key) {
        if (prop)
          eval('delete data.' + key)
      })

      data.money_rewards = _.object(_.map(data.money_rewards, function(reward) {
        return [reward.currency, reward.value]
      }))

      data.conditions.forEach(function(condition) {
        condition.metric = condition.metric.metric_name

        if (!isNaN(condition.value) && condition.value !== '' && condition.value !== null)
          condition.value = parseFloat(condition.value)

        delete condition._id
      })

      if (data.progress.metric !== undefined && data.progress.metric !== null)
        data.progress.metric = data.progress.metric.metric_name

      data.metrics.forEach(function(metric) {
        metric.event_type = metric.event_type.event_type

        delete metric._id

        if (!metric.condition) return

        metric.condition.forEach(function(condition, index) {
          condition = angular.fromJson(angular.toJson(condition))

          condition.metric = condition.metric.value

          metric.condition[index] = _.values(condition).join(' ')
        })

        metric.condition = metric.condition.join(' and ') || null
      })

      data.events.forEach(function(event) {
        delete event._id
      })

      delete data.removeProps

      return data
    }

    function _prepareSubmitGeneralData(data) {
      var data = _.cloneDeep(data)

      data.quest_id = $stateParams.questId

      delete data.id
      delete data.project_id
      delete data.image_path

      if (vm.action == 'update')
        delete data.quest_id

      return data
    }

    function _prepareSubmitTestData(data) {
      data = _.cloneDeep(data)
      data.events = eval('(' + data.events.replace(/(\r\n|\n|\r)/gm, '') + ')');

      return data
    }

    function groupByAchievements(achievement) {
      if (!achievement) return

      return _.find(vm.groups, {id: achievement.group_id}).name
    }

    function addCondition() {
      vm.logic.conditions.push({
        metric: '',
        op: '',
        value: '',
      })
    }

    function removeCondition(index) {
      vm.logic.conditions.splice(index, 1)
    }

    function addEvent() {
      vm.logic.events.push({
        _id: Math.random(),
        event_type: '',
        field: '',
        field_type: '',
      })
    }

    function removeEvent(index) {
      vm.logic.events.splice(index, 1)
    }

    function addMetric() {
      vm.logic.metrics.push({
        _id: Math.random(),
        condition: [],
        metric_name: '',
        event_type: '',
        initial_value: '',
      })
    }

    function removeMetric(index) {
      vm.logic.metrics.splice(index, 1)
    }

    function addMetricCondition(metricIndex) {
      vm.logic.metrics[metricIndex].condition.push({
        metric: '',
        op: '',
        value: '',
      })
    }

    function removeMetricCondition(metricIndex, conditionIndex) {
      vm.logic.metrics[metricIndex].condition.splice(conditionIndex, 1)
    }

    function removeImage() {
      vm.uploader.clearQueue()

      if (vm.achievement.image_path)
        vm.uploader.dropExistingImage = true
    }

    function addReward() {
      vm.logic.money_rewards.push({})
    }

    function removeReward($index) {
      vm.logic.money_rewards.splice($index, 1)
    }

    function toggleMetricConditioned(index, conditioned) {
      vm.logic.removeProps['metrics[' + index + '].condition'] =
          vm.logic.removeProps['metrics[' + index + '].false_formula'] = !conditioned

      if (!vm.logic.metrics[index].condition.length)
        vm.logic.metrics[index].condition.push({})
    }

    function submit() {
      var generalData = _prepareSubmitGeneralData(vm.achievement)
      var logicData = _prepareSubmitLogicData(vm.logic)

      var generalAction = AchievementsService.API[vm.action]
      var logicAction = AchievementsService.API.setLogic;

      var generalArgs = vm.action == 'update' ?
          [$stateParams.projectId, vm.achievement.id, generalData] :
          [$stateParams.projectId, generalData];

      return generalAction.apply(this, generalArgs)
          .then(function(generalData) {
            if (!vm.uploader.dropExistingImage) return generalData

            return AchievementsService.API
                .removeImage($stateParams.projectId, generalData.id)
                .then(function() {
                  generalData.image_path = null

                  return generalData
                })
          })
          .then(function(generalData) {
            var def = $q.defer()

            vm.uploader.queue.forEach(function(item) {
              item.url = '/api/admin/project/' + $stateParams.projectId + '/achievement/' + generalData.id + '/image'
            })

            vm.uploader.uploadAll()

            vm.uploader.onCompleteItem = function(item, response) {
              generalData.image_path = response.image_path
            }

            if (!vm.uploader.queue.length)
              def.resolve(generalData)
            else
              vm.uploader.onCompleteAll = function() {
                def.resolve(generalData)
              };

            return def.promise
          })
          .then(function(generalData) {
            vm.achievement = generalData.toJSON()
            vm.action = 'update'

            if (!$scope.hasProjectPermission('achievement_logic'))
              return generalData

            var logicArgs = [generalData.project_id, generalData.id, logicData];

            return logicAction.apply(this, logicArgs).then(function() {
              return generalData
            })
          })
          .then(function(generalData) {
            $modalInstance.close(generalData.toJSON());
          });
    }

    function testSubmit() {
      var error = 'Please, use a correct JSON format'

      vm.createUpdateAchievementForm.testData.$setValidity(error, true);

      try {
        var testData = _prepareSubmitTestData(vm.testData)

        AchievementsService.API.test($stateParams.projectId, vm.achievement.id, testData)
            .then(function(response) {
              vm.testResult = JSON.stringify(response.results, null, ' ')
            }, function(response) {
              vm.testResult = JSON.stringify(response.data.error.fields.events, null, ' ')
            })

      } catch(e) {
        vm.createUpdateAchievementForm.testData.$setValidity(error, false)
      }
    }

    function createNewCurrency() {
      var currencies = _.cloneDeep(vm.project.currencies)

      if (~currencies.indexOf(vm.newCurrency)) {
        toastr.error('This currency already exist')

        return
      }

      currencies.push(vm.newCurrency)

      ProjectsService.API.update($stateParams.projectId, {currencies: currencies})
        .then(function(response) {
          _.assign(vm.project, response)
          vm.newCurrency = null
          vm.newCurrencyMode = false
        }, function(error) {
          var errorText = error.data.error && error.data.error.fields && error.data.error.fields.currencies ?
            'New currency: ' + error.data.error.fields.currencies[currencies.length - 1] :
            error.data.error_reason

          toastr.error(errorText)
        })
    }
  }
})();
