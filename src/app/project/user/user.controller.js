(function() {
  'use strict';

  angular.module('app.project.user')
    .controller('UserCtrl', UserCtrl);

  UserCtrl.$inject = ['$popover', 'data'];

  function UserCtrl($popover, data) {
    var vm = this;

    activate()

    function activate() {
      vm.user = data.userResponse

      vm.achievements = data.userAchievementsResponse.results
      vm.quests = _.uniq(_.map(vm.achievements, function(achievement) {
        return {
          id: achievement.quest_id,
          name: achievement.quest_name
        }
      }), 'id')

      vm.gifts = [
        {
          name: 'Iphone',
          place: '1th',
          winners: 3,
          description: '' +
          'Pellentesque habitant morbi tristique senectus et' +
          ' netus et malesuada fames ac turpis egestas. Vestibulum tortor ' +
          'quam, feugiat vitae, ultricies eget, tempor sit amet, ante. ' +
          'Donec eu libero sit amet quam egestas semper. Aenean ultricies ' +
          'mi vitae est. Mauris placerat eleifend leo.',
          image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRF60IIMU6W3RjIQUPlYuPP1quxdXm-FzMnhc_nXZirAG0tjshYqw',
        },
        {
          name: 'Iphone',
          place: '1th',
          winners: 3,
          description: '' +
          'Pellentesque habitant morbi tristique senectus et' +
          ' netus et malesuada fames ac turpis egestas. Vestibulum tortor ' +
          'quam, feugiat vitae, ultricies eget, tempor sit amet, ante. ' +
          'Donec eu libero sit amet quam egestas semper. Aenean ultricies ' +
          'mi vitae est. Mauris placerat eleifend leo.',
          image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRF60IIMU6W3RjIQUPlYuPP1quxdXm-FzMnhc_nXZirAG0tjshYqw',
        },
        {
          name: 'Iphone',
          place: '1th',
          winners: 3,
          description: '' +
          'Pellentesque habitant morbi tristique senectus et' +
          ' netus et malesuada fames ac turpis egestas. Vestibulum tortor ' +
          'quam, feugiat vitae, ultricies eget, tempor sit amet, ante. ' +
          'Donec eu libero sit amet quam egestas semper. Aenean ultricies ' +
          'mi vitae est. Mauris placerat eleifend leo.',
          image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRF60IIMU6W3RjIQUPlYuPP1quxdXm-FzMnhc_nXZirAG0tjshYqw',
        }
      ]

      _userPrepare()
    }

    function _userPrepare() {
      if (!vm.user.last_event)
        return

      vm.user.last_event = moment(vm.user.last_event)

      vm.achievements.forEach(function(achievement) {
        achievement.finished = moment(achievement.finished).format('DD.MM.YYYY HH:mm')
      })

      var now = moment()

      now.set('hour', vm.user.last_event.get('hours'))
      now.set('minute', vm.user.last_event.get('minutes'))
      now.set('second', vm.user.last_event.get('seconds'))
      now.set('millisecond', vm.user.last_event.get('milliseconds'))

      var diff = now.diff(moment(vm.user.last_event), 'days')

      vm.user.last_event = diff > 0 ? diff + 'd' : 'Today'
    }
  };

})();