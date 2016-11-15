let Auth = require("./auth");

module.exports = class Compass {
	constructor(serverurl, username, password) {
		this.url = serverurl;
		this.auth = new Auth(username, password);
	}
}