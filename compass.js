const debug = require("./debug")("Core");

const Auth = require("./auth");
const News = require("./news");

module.exports = class Compass {
	constructor(serverurl, username, password, options = {}) {
		debug("Initialising Compass");
		this.options = options;
		this.auth = new Auth(serverurl, username, password, this.options.request);

		const modules = this.options.modules || [];
		if (modules.indexOf("news") != -1) {
			// News module is enabled
			this.news = new News(this.auth);
		}
	}
}

const repl = require("repl");
C = module.exports;
let r = repl.start("> ");
r.context.C = C;

