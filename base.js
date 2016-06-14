"use strict";

const events = require("events");

class ClassBase extends events.EventEmitter {
	constructor() {
		super();
	}
}

module.exports = ClassBase;