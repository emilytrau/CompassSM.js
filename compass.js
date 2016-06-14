"use strict";
const events = require("events");
const Q = require("q");
const request = require("request");

const ClassBase = require("./base.js")
const Auth = require("./auth.js");
const Schedule = require("./schedule.js");

//Compass Class
//Mix-ins: Auth 
class Compass extends Auth(ClassBase) {
	constructor(config) {
		super();

		if (!config || !config.url || typeof(config.url) != "string" || !config.username || !config.password) throw new Error("Invalid config");
		this.config = config;

		this.getNewToken();
	}
}

module.exports = Compass;