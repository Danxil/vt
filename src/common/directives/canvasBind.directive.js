(function () {
  'use strict';

  angular
      .module('app.directives')
      .directive('canvasBind', canvasBind);

  canvasBind.$inject = [];

  function canvasBind() {

    var directive = {
      restrict: 'A',
      link: linkFunction,
      scope: {
        canvasBind: '&'
      }
    }

    return directive;

    function linkFunction(scope, element, attrs) {
      var canvas = element.find('[bottom-canvas]')[0];
      var context = canvas.getContext('2d');
      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;
      var radius = 44;

      context.beginPath();
      context.arc(centerX, centerY, radius, 1.5 * Math.PI, (scope.canvasBind() / 100 * 2 + 1.5) * Math.PI, false);
      context.fillStyle = 'white';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#87CEEB';
      context.stroke();


      var canvas = element.find('[top-canvas]')[0];
      var context = canvas.getContext('2d');
      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;
      var radius = 44;

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.fillStyle = 'white';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#E4E4E4';
      context.stroke();
    }
  }
})();