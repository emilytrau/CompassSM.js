const Auth = require("./auth");
const News = require("./news");

module.exports = class Compass {
	constructor(serverurl, username, password, options = {}) {
		this.options = options;
		this.auth = new Auth(serverurl, username, password, this.options.request);

		const modules = this.options.modules || [];
		if (modules.indexOf("news") != -1) {
			// News module is enabled
			this.news = new News(this.auth);
		}
	}

	async initialise() {
		await this.auth.initialise();
	}
}

const repl = require("repl");
C = module.exports;
let r = repl.start("> ");
r.context.C = C;

