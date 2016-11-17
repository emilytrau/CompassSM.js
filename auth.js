const request = require("request");
const cheerio = require("cheerio");
const url = require("url");

class StatusCodeError extends Error {
	constructor(code) {
		const message = `Invalid status code ${code}`;
		super(message);
		this.message = message;
		this.name = 'StatusCodeError';
	}
}

module.exports = class Auth { 
	constructor(url, username = "", password = "", options = {}) {
		this.username = username;
		this.password = password;

		options.baseUrl = url;
		options.method = "GET";
		options.headers = {
			// Spoof Chrome 54
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/;q=0.8",
			"Accept-Language": "en-US,en;q=0.8",
			"Connection": "keep-alive",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
		};
		options.jar = true;

		this.request = request.defaults(options);
	}

	async reauth() {
		// Start with a blank cookie jar
		let j = request.jar();
		// Overide current cookie jar with blank one
		this.request = this.request.defaults({
			jar: j
		});

		// Get the login page
		// Retrieves a session cookie
		let $login;
		try {
			let [body, res] = await this.get("/login.aspx", {
				qs: {
					"sessionstate": "disabled"
				}
			});

			$login = cheerio.load(body);
		} catch(e) {
			throw e;
		}

		// Log in
		// Get an auth cookie
		try {
			let [body, res] = await this.get("/login.aspx", {
				method: "POST",
				headers: {
					"Cache-Control": "max-age=0"
				},
				qs: {
					"sessionstate": "disabled"
				},
				form: {
					__VIEWSTATE: $login("#__VIEWSTATE").val(),
					username: this.username,
					password: this.password,
					button1: "Sign in",
					__VIEWSTATEGENERATOR: $login("#__VIEWSTATEGENERATOR").val()
				},
				maxRedirects: 0,
				intendedStatusCode: 302
			});
		} catch(e) {
			throw e;
		}
	}
	
	async_request(options = {}) {
		return new Promise((resolve, reject) => {
			this.request(options, (err, res, body) => {
				if (err) {
					reject(err);
					return;
				} else {
					resolve([body, res]);
				}
			});
		});
	}

	async get(path = "", options = {}) {
		options.uri = path;
		const intendedStatusCode = options.intendedStatusCode || 200;
		
		let body, res;
		try {
			[body, res] = await async_request(options);

			if (res.statusCode != intendedStatusCode) {
				// Request yielded unexpected result
				// Check if auth failed
				const redirectLocation = url.parse(res.headers.Location || "").pathname;
				if (res.statusCode === 302 && redirectLocation === "/login.aspx")
				{
					// Auth expired
					// Reauthenticate
					await this.reauth();
					// Try again
					[body, res] = await async_request(options);
					if (res.statusCode != intendedStatusCode) {
						throw new StatusCodeError(res.statusCode);
					}
				} else {
					throw new StatusCodeError(res.statusCode);
				}
			}
		} catch(e) {
			throw e;
		}
	}
}