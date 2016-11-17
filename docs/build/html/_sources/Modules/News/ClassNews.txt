Class: News
===========

.. js:function:: async compass.news.get([start][, limit])

    :param number start: The article number to start fetching at. Defaults to ``0``.
    :param number limit: The number of articles to fetch. Will fetch up to and equal to this number of articles. Defaults to ``10``.
    :returns: ``NewsItem[]``