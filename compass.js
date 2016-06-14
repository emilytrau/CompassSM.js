"use strict";
const events = require("events");
const Q = require("q");
const request = require("request");

const Auth = require("./auth.js");
const Schedule = require("./schedule.js");

class Compass extends Auth(events.EventEmitter) {
	constructor(config) {
		super();

		if (!config || !config.url || typeof(config.url) != "string" || !config.username || !config.password) throw new Error("Invalid config");
		this.config = config;
		
		this.auth = new Auth(this.config);
	}
}

module.exports = Compass;