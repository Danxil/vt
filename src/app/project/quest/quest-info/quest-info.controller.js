(function() {
  'use strict';

  angular.module('app.project.quest.quest-info')
    .controller('QuestInfoCtrl', QuestInfoCtrl);

  QuestInfoCtrl.$inject = ['QuestsService',
    '$stateParams',
    '$scope',
    '$modal',
    '$q',
    '$state',
    '$filter',
    'CRON_TEMPLATES',
    'DATE_FORMAT',
    'toastr',
    'data'
  ];

  function QuestInfoCtrl(QuestsService,
                         $stateParams,
                         $scope,
                         $modal,
                         $q,
                         $state,
                         $filter,
                         CRON_TEMPLATES,
                         DATE_FORMAT,
                         toastr,
                         data) {
    var vm = this;

    vm.durationErrors = {
      min: 'Minimal value: 0',
      number: 'Must be a number'
    }


    vm.CRON_TEMPLATES = CRON_TEMPLATES

    vm.updateQuest = updateQuest;
    vm.deleteQuest = deleteQuest;
    vm.updateCron = updateCron;
    vm.toggleCron = toggleCron;
    vm.quest = $scope.quest;
    vm.questTimezones = data.questTimezonesPromise
    vm.timelineOptions = {
      height: 250,
      zoomMax: 3155695200001.1387
    }

    $scope.$watch('vm.quest.cron', _compareQuestCronWithOriginal, true)
    $scope.$watch('vm.quest.removeProps.cron', _compareQuestCronWithOriginal, true)
    $scope.$watch('vm.quest.removeProps.cron', _updateTimelineData, true)

    _activate();

    function _activate() {
      if (!vm.quest.removeProps)
        vm.quest.removeProps = {}

      vm.quest.removeProps.cron = !!!vm.quest.cron
      vm.quest.cronAbsentOriginal = vm.quest.removeProps.cron

      vm.quest.cron = _prepareGetCron(vm.quest.cron)
      vm.quest.cronOriginal = _.cloneDeep(vm.quest.cron)

      _updateTimelineData()
    }

    function updateQuest(propertyObj) {
      if (propertyObj.start_date)
        propertyObj.start_date = moment(propertyObj.start_date).format(DATE_FORMAT)

      if (propertyObj.end_date)
        propertyObj.end_date = moment(propertyObj.end_date).format(DATE_FORMAT)

      if (propertyObj.timezone) {
        propertyObj.start_date = moment(vm.quest.start_date)
          .tz(propertyObj.timezone)
          .format(DATE_FORMAT)

        propertyObj.end_date = moment(vm.quest.end_date)
          .tz(propertyObj.timezone)
          .format(DATE_FORMAT)
      }

      return QuestsService.API.update($stateParams.projectId, $stateParams.questId, propertyObj)
        .then(function(response) {
          _.assign(vm.quest, response.toJSON())

          _activate()

          return response
        }, function(error) {
          _.each(error.data.error.fields, function(value, key) {
            if (_.isUndefined(propertyObj[key]))
              toastr.error(key + ' ' + value)
          })

          return $q.reject(error)
        });
    }

    function deleteQuest() {
      $modal.open({
        templateUrl: 'app/project/quest/quest-info/delete-quest.tpl.html',
        controller: 'DeleteQuestCtrl',
        controllerAs: 'vm',
        resolve: {
          data: function() {
            return {
              quest: $scope.quest
            }
          }
        }
      }).result.then(function(result) {
          $state.go('app.project.dashboard', {projectId: $stateParams.projectId})
        });
    }

    function toggleCron() {
      vm.quest.removeProps.cron = !vm.quest.removeProps.cron
    }

    function updateCron() {
      var cron = _prepareUpdateCron(vm.quest.cron)

      if (cron.phase_duration < 60) {
        toastr.error('Duration must be more than 0 minutes')

        return
      }

      return updateQuest({cron: cron}).then(function(quest) {
        vm.quest.cron = _prepareGetCron(quest.cron)
        vm.quest.cronOriginal = _.cloneDeep(vm.quest.cron)
        vm.quest.cronAbsentOriginal = !!!quest.cron

        _compareQuestCronWithOriginal()
      })
    }

    function _compareQuestCronWithOriginal() {
      vm.updateCronEnabled = angular.toJson(_.cloneDeep(vm.quest.cron)) != angular.toJson(_.cloneDeep(vm.quest.cronOriginal)) ||
        vm.quest.removeProps.cron != vm.quest.cronAbsentOriginal
    }

    function _prepareUpdateCron(cron) {
      if (vm.quest.removeProps.cron) return null

      cron = _.cloneDeep(cron)

      cron.phase_duration = _phaseDurationObjectToSeconds(cron.phase_duration)

      cron.cron_tmpl = _.map(vm.CRON_TEMPLATES, function(template) {
        return cron.cron_tmpl[template.name].join(',') || '*'
      })

      cron.cron_tmpl = cron.cron_tmpl.join(' ')

      return cron
    }

    function _prepareGetCron(cron) {
      cron = _.cloneDeep(cron)

      if (!cron)
        cron = {
          cron_tmpl: '0 0 * * *',
          is_reset_progress: false,
          phase_duration: null
        }

      if (!_.isUndefined(cron.phase_duration))
        cron.phase_duration = _phaseDurationSecondsToObject(cron.phase_duration)

      if (_.isString(cron.cron_tmpl)) {
        cron.cron_tmpl = cron.cron_tmpl.split(' ')

        var cronTemplateResult = {}

        cron.cron_tmpl.forEach(function(template, templateIndex) {
          template = template.split(',')
          template = _.map(template, function(template) {
            return !isNaN(parseInt(template)) ? parseInt(template) : '*'
          })

          cronTemplateResult[vm.CRON_TEMPLATES[templateIndex].name] = template
        })

        cron.cron_tmpl = cronTemplateResult
      }

      return cron
    }

    function _updateTimelineData() {
      vm.timelineData = _getTimelineData()
    }

    function _phaseDurationSecondsToObject(phaseDuration) {
      var days = parseInt(phaseDuration / 86400)
      var hours = parseInt((phaseDuration - days * 86400) / 3600)
      var minutes = parseInt((phaseDuration - (days * 86400 + hours * 3600)) / 60)

      return {
        days: days,
        hours: hours,
        minutes: minutes
      }
    }

    function _phaseDurationObjectToSeconds(phaseDuration) {
      phaseDuration = _.cloneDeep(phaseDuration)

      phaseDuration.days *= 86400
      phaseDuration.hours *= 3600
      phaseDuration.minutes *= 60

      return _.reduce(phaseDuration, function(first, two) {
        return first + two
      }, 0)
    }

    function _getTimelineData() {
      var arr = []

      if (!vm.quest.start_date) return arr

      var range = {
        from: vm.quest.start_date,
        to: vm.quest.end_date || moment(vm.quest.start_date).add('years', 3)
      }

      var filter = _.cloneDeep(vm.quest.cron.cron_tmpl)

      filter.dates = filter.daysOfMonth
      filter.days = filter.daysOfWeek

      if (parseInt(filter.months))
        filter.months = _.map(filter.months, function(month) {
          return --month
        })

      arr = $filter('dateRangesFilter')(range, filter, 20)

      arr = _.map(arr, function(range, index) {
        return arr[index] = {
          content: 'Quest iteration ' + ++index,
          start: range.from,
          end: range.from.clone().add('seconds', _phaseDurationObjectToSeconds(vm.quest.cron.phase_duration)),
        }
      })

      if (vm.quest.end_date)
        var questPeriod = {
          content: 'Quest period',
          start: vm.quest.start_date,
          end: vm.quest.end_date,
          type: 'background',
        }
      else
        questPeriod = {
          content: 'Quest start',
          start: vm.quest.start_date,
          end: vm.quest.end_date,
          type: 'point',
        }

      arr.push(questPeriod)

      return arr
    }
  };

})();