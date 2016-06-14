"use strict";
const Q = require("q");

const ClassBase = require("./base.js");
const Auth = require("./auth.js");
const News = require("./news.js");
const Schedule = require("./schedule.js");

//Compass Class
//Mix-ins: Auth 
class Compass extends Auth(ClassBase) {
	constructor(config) {
		super();

		if (!config || !config.url || typeof(config.url) != "string" || !config.username || !config.password) throw new Error("Invalid config");
		this.config = config;

		this.getNewSession()
		.then(() => {
			//Logged in
			//Load news and pass it a wrapper function to get the current request object as well as the config
			this.news = new News(() => {return this.request;});
			return this.news.getNews();
		})
		.done();
	}
}

module.exports = Compass;