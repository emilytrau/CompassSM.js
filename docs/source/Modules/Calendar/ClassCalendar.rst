Class: Calendar
===============

.. js:function:: async compass.calendar.getEvents([start][, limit][, startDate][, endDate])

    Fetches calendar events between startDate and endDate (inclusive).

    :param number start: The event number to start fetching at. Defaults to ``0``.
    :param number start: The max number of events to fetch. Defaults to ``25``.
    :param Date startDate: Defaults to ``today``.
    :param Date endDate:  Defaults to ``today``.
    :returns: ``CalendarEvent[]``