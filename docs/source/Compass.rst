Compass
=======

.. js:class:: Compass(server, username, password, options)

    :param string server: The server to connect to. In the form of ``https://XXX-XXX.compass.education`` or ``https://XXX.XXX.jdlf.com.au``.
    :param string username: Your Compass username.
    :param string password: Your Compass password.
    :param object options:
        Options used to configure Compass.

        * ``modules`` - An array that lists the Compass features to enable. Available options are:

          * ``news``
          * ``calendar``
        * ``request`` - An object containing options to pass to request.js. See https://github.com/request/request#requestoptions-callback.

.. js:function::  async compass.initialise()

    Initialises Compass library, as the process is asynchronous.