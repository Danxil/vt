(function() {
  'use strict';

  angular.module('app.project.quest')
      .controller('QuestCtrl', QuestCtrl);

  QuestCtrl.$inject = ['$stateParams', '$modal', 'data', '$scope'];

  function QuestCtrl($stateParams, $modal, data, $scope) {

    _activate()

    function _activate() {
      $scope.quest = data.questResponse.toJSON()
    }
  };

})();