describe('length filter', function () {
    function _check(result, expected) {
        expect(result.length).toEqual(expected.length)
        _.each(result, function (range, index) {
            range = {
                from: range.from.format('YYYY-MM-DD HH:mm'),
                to: range.to.format('YYYY-MM-DD HH:mm')
            }

            expect(JSON.stringify(range)).toEqual(JSON.stringify(expected[index]))
        })
    }

    beforeEach(module('app'));

    var $filter
    var dateRangesFilter

    beforeEach(inject(function (_$filter_) {
        $filter = _$filter_
        dateRangesFilter = $filter('dateRangesFilter');
    }));

    it('returns moths array betwen two dates', function () {
        var ranges = [
            {
                from: moment('2015-12-12 00:00'),
                to: moment('2016-04-12 00:00')
            }
        ]

        var filter = [11, 0]

        var expected = [
            {
                from: '2015-12-12 00:00',
                to: '2015-12-31 23:59',
            },
            {
                from: '2016-01-01 00:00',
                to: '2016-01-31 23:59',
            },
        ]

        var result = dateRangesFilter(ranges, filter, 'months')

        _check(result, expected)
    });

    //==============================

    it('returns days of week array betwen two dates', function () {
        var ranges = [
            {
                from: moment('2015-12-12 00:00'),
                to: moment('2015-12-31 23:59'),
            },
            {
                from: moment('2016-01-01 00:00'),
                to: moment('2016-01-31 23:59'),
            },
        ]

        var filter = [1]

        var expected = [
            {
                from: '2015-12-14 00:00',
                to: '2015-12-14 23:59',
            },
            {
                from: '2015-12-21 00:00',
                to: '2015-12-21 23:59',
            },
            {
                from: '2015-12-28 00:00',
                to: '2015-12-28 23:59',
            },
            {
                from: '2016-01-04 00:00',
                to: '2016-01-04 23:59',
            },
            {
                from: '2016-01-11 00:00',
                to: '2016-01-11 23:59',
            },
            {
                from: '2016-01-18 00:00',
                to: '2016-01-18 23:59',
            },
            {
                from: '2016-01-25 00:00',
                to: '2016-01-25 23:59',
            },
        ]

        var result = dateRangesFilter(ranges, filter, 'days')

        _check(result, expected)
    });

    //==============================

    it('returns days of month array betwen two dates', function () {
        var ranges = [
            {
                from: moment('2016-01-14 00:00'),
                to: moment('2016-01-14 23:59'),
            },
            {
                from: moment('2016-01-21 00:00'),
                to: moment('2016-01-21 23:59'),
            },
            {
                from: moment('2016-01-28 00:00'),
                to: moment('2016-01-28 23:59'),
            },
        ]

        var filter = [21]

        var expected = [
            {
                from: '2016-01-21 00:00',
                to: '2016-01-21 23:59',
            },
        ]

        var result = dateRangesFilter(ranges, filter, 'dates')

        _check(result, expected)
    });

    //==============================

    it('returns hours array betwen two dates', function () {
        var ranges = [
            {
                from: moment('2016-01-21 00:00'),
                to: moment('2016-01-21 23:59'),
            }
        ]

        var filter = [3, 15]

        var expected = [
            {
                from: '2016-01-21 03:00',
                to: '2016-01-21 03:59',
            },
            {
                from: '2016-01-21 15:00',
                to: '2016-01-21 15:59',
            }
        ]

        var result = dateRangesFilter(ranges, filter, 'hours')

        _check(result, expected)
    });


    //==============================

    it('returns minutes array betwen two dates', function () {
        var ranges = [
            {
                from: moment('2015-12-21 03:00'),
                to: moment('2015-12-21 03:59'),
            },
            {
                from: moment('2015-12-21 15:00'),
                to: moment('2015-12-21 15:59'),
            }
        ]

        var filter = [11, 35]

        var expected = [
            {
                from: '2015-12-21 03:11',
                to: '2015-12-21 03:11',
            },
            {
                from: '2015-12-21 03:35',
                to: '2015-12-21 03:35',
            },
            {
                from: '2015-12-21 15:11',
                to: '2015-12-21 15:11',
            },
            {
                from: '2015-12-21 15:35',
                to: '2015-12-21 15:35',
            }
        ]

        var result = dateRangesFilter(ranges, filter, 'minutes')

        _check(result, expected)
    });

    it('returns minutes array betwen two dates with multiple filters', function () {
        var ranges = [
            {
                from: moment('2015-12-12 00:00'),
                to: moment('2016-04-12 00:00')
            }
        ]

        var filter = {
            months: [11, 0],
            days: [1],
            dates: [21],
            hours: [3, 15],
            minutes: [11, 35]

        }

        var expected = [
            {
                from: '2015-12-21 03:11',
                to: '2015-12-21 03:11',
            },
            {
                from: '2015-12-21 03:35',
                to: '2015-12-21 03:35',
            },
            {
                from: '2015-12-21 15:11',
                to: '2015-12-21 15:11',
            },
            {
                from: '2015-12-21 15:35',
                to: '2015-12-21 15:35',
            }
        ]

        var result = dateRangesFilter(ranges, filter)

        _check(result, expected)
    });

    it('returns minutes array betwen two dates wit max length 20', function () {
        var ranges = [
            {
                from: moment('2015-12-12 00:00'),
                to: moment('2016-04-12 00:00')
            }
        ]

        var filter = 'minutes'

        var expected = 20

        var result = dateRangesFilter(ranges, '*', 'minutes', 20)

        expect(result.length).toEqual(expected)
    });

    it('returns minutes array betwen two dates with multiple filters and max length 20', function () {
        var ranges = [
            {
                from: moment('2015-12-12 00:00'),
                to: moment('2016-04-12 00:00')
            }
        ]

        var filter = {
            months: '*',
            days: '*',
            dates: '*',
            hours: '*',
            minutes: '*'

        }

        var expected = 20

        var result = dateRangesFilter(ranges, filter, 20)

        expect(result.length).toEqual(expected)
    });
});