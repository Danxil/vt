(function() {
  'use strict';

  function _filter(items, filter, field, maxLength, notLast) {
    var result = []

    var key = field.replace(/s$/, '')

    if (field == 'dates') field = 'days'

    items.forEach(function(item) {
      item.from = moment(item.from)
      item.to = moment(item.to)

      var currDate = item.from.clone()
      var lastDate = item.to.clone()

      do {
        if (!notLast && result.length >= maxLength)
          break

        if (!~filter.indexOf(currDate.get(key)) && filter != '*')
          continue

        result.push({
          from: currDate.clone().diff(item.from) == 0 ?
            item.from.clone() :
            currDate.clone().startOf(key),
          to: currDate.clone().add(1, field).diff(lastDate) >= 0 ?
            item.to.clone() :
            currDate.clone().endOf(key)
        })
      } while (currDate.add(1, field).diff(lastDate) < 0)
    })

    return result;
  }

  function _rec(items, filter, maxLength) {
    var result = items

    _filterOrder.forEach(function(filterName) {
      if (!filter[filterName]) return

      var notLast = filterName != _filterOrder[_filterOrder.length - 1]

      result = _filter(result, filter[filterName], filterName, maxLength, notLast)
    })

    return result
  }

  var _filterOrder = [
    'months',
    'days',
    'dates',
    'hours',
    'minutes',
  ]

  angular
    .module('app.filters')
    .filter('dateRangesFilter', function() {
      return function(items, filter, field, maxLength) {
        if (!_.isArray(items)) items = [items]

        if (_.isArray(filter) || _.isString(filter))
          return _filter.apply(this, arguments)
        else {
          maxLength = field

          return _rec(items, filter, maxLength)
        }
      }
    });
})();