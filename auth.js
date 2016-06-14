"use strict";
const Q = require("q");
const _request = require("request");
const cheerio = require("cheerio");

const ClassBase = require("./base.js");
const log = require("./log.js");

//Create Auth Mix-in
let Auth = ClassBase => class extends ClassBase {
	getNewSession() {
		let deferred = Q.defer();

		let cookieJar = _request.jar();
		let request = _request.defaults({
			baseUrl: this.config.url,
			headers: {
				"User-Agent": this.config.useragent
			},
			followAllRedirects: true,
			jar: cookieJar
		})

		request("/login.aspx", (error, response, body) => {
			if (!error && response.statusCode == 200) {
				if (this.config.debug) {
					log("Auth - Found website");
				}

				//Get unique session codes
				let $ = cheerio.load(body);
				let __VIEWSTATE = $("#__VIEWSTATE").attr("value");
				let __VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR").attr("value");

				request.post("/login.aspx", {
					form: {
						__VIEWSTATE: __VIEWSTATE,
						__VIEWSTATEGENERATOR: __VIEWSTATEGENERATOR,
						username: this.config.username,
						password: this.config.password,
						button1: "Sign in",
						rememberMeChk: "on"
					}
				}, (error, response, body) => {
					if (!error && response.statusCode == 200) {
						if (this.config.debug) {
							log("Auth - Logged in!");
						}
						
						//Successfully created session cookies
						this.request = request;
						this.cookieJar = cookieJar;

						deferred.resolve();
					} else {
						deferred.reject(error);
					}
				});
			} else {
				deferred.reject(error);
			}
		});

		//Create a new session every hour by default
		if (this.sessionTimeoutID) clearTimeout(this.sessionTimeoutID);
		this.sessionTimeoutID = setTimeout((t) => {t.getNewSession.call(t)}, this.config.sessionTimeout, this);

		return deferred.promise;
	}
}

module.exports = Auth;