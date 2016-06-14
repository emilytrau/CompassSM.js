"use strict";
const Q = require("q");

const ClassBase = require("./base.js");
const log = require("./log.js");
const Auth = require("./auth.js");
const News = require("./news.js");
const Schedule = require("./schedule.js");

//Compass Class
//Mix-ins: Auth 
class Compass extends Auth(ClassBase) {
	constructor(config) {
		super();

		let defaultConfig = {
			useragent: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36", //Chrome 51
			sessionTimeout: 3600000,
			debug: false
		}
		if (!config || !config.url || typeof(config.url) != "string" || !config.username || !config.password) throw new Error("Invalid config");
		for (var key in config) {defaultConfig[key] = config[key];}
		this.config = defaultConfig;

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