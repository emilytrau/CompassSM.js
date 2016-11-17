.. highlight:: javascript

Getting Started
===============

Installation
------------

To include CompassSM.js in your project, simply install it from NPM ::

	> npm install CompassSM --save

Then include it in your project ::

	const Compass = require("CompassSM");

Example
-------
This code connects to Compass and fetches the news feed::

	const Compass = require("CompassSM");

	const server = process.env.compass_server; // https://XXX-XXX.compass.education OR https://XXX.XXX.jdlf.com.au
	const username = process.env.compass_username;
	const password = process.env.compass_password;

	const options = {
		// The modules to enable
		modules: [
			"news"
		]
	}

	// Create a new connection to Compass
	let c = new Compass(server, username, password, options);

	// Run the folowing code asynchronously
	(async () => {
		// Fetch the news
		let news = await c.news.get();
		console.log(news);
	})();