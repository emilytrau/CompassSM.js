let Auth = require("./auth");

module.exports = class Compass {
	constructor(serverurl, username, password) {
		this.auth = new Auth(serverurl, username, password);
	}

	async initialise() {
		await this.auth.initialise();
	}
}

const repl = require("repl");
C = module.exports;
let r = repl.start("> ");
r.context.C = C;