"use strict";
const events = require("events");
const Q = require("q");
const request = require("request");
const cheerio = require("cheerio");

const ClassBase = require("./base.js");

//Create Auth Mix-in
let Auth = ClassBase => class extends ClassBase {
	getNewToken() {
		let deferred = Q.defer();

		this.request = request.defaults({
			baseUrl: this.config.url,
			headers: {
				"User-Agent": this.config.useragent || "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36" //Chrome 51
			},
			followAllRedirects: true,
			jar: request.jar()
		})

		this.request("/login.aspx", (error, response, body) => {
			if (!error && response.statusCode == 200) {
				//Get unique session codes
				let $ = cheerio.load(body);
				let __VIEWSTATE = $("#__VIEWSTATE").attr("value");
				let __VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR").attr("value");

				this.request.post("/login.aspx", {
					form: {
						__VIEWSTATE: __VIEWSTATE,
						__VIEWSTATEGENERATOR: __VIEWSTATEGENERATOR,
						username: this.config.username,
						password: this.config.password,
						button1: "Sign in",
						rememberMeChk: "on"
					}
				}, (error, response, body) => {
					console.log(body);
				})
			} else {
				this.emit("compass_error", "Invalid url", error);
			}
		});
	}
}

module.exports = Auth;