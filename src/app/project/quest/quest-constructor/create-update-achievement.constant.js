(function() {
  'use strict';

  var LOGIC_OPERATORS = [
    ">",
    "<",
    ">=",
    "<=",
    "==",
    "!=",
    "~=",
    "in"
  ];

  var VALUE_TYPES = [
    "number",
    "string",
    "bool",
  ];

  var DEFAULT_HINTS = [
    'user_id',
    'event_type',
    'create_time'
  ]

  angular
      .module('app.project.quest.quest-constructor')
      .constant('LOGIC_OPERATORS', LOGIC_OPERATORS)
      .constant('DEFAULT_HINTS', DEFAULT_HINTS)
      .constant('VALUE_TYPES', VALUE_TYPES);
})();