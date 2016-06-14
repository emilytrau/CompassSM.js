"use strict";
const Q = require("q");
const request = require("request");
const cheerio = require("cheerio");

const ClassBase = require("./base.js");

//Create Auth Mix-in
let Auth = ClassBase => class extends ClassBase {
	getNewSession() {
		let deferred = Q.defer();

		let cookieJar = request.jar();
		let request = request.defaults({
			baseUrl: this.config.url,
			headers: {
				"User-Agent": this.config.useragent || "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36" //Chrome 51
			},
			followAllRedirects: true,
			jar: cookieJar
		})

		request("/login.aspx", (error, response, body) => {
			if (!error && response.statusCode == 200) {
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
		this.sessionTimeoutID = sessionTimeout((t) => {t.getNewSession.call(t)}, this.config.sessionTimeout || 3600000, this);

		return deferred.promise;
	}
}

module.exports = Auth;