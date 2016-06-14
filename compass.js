var Q = require("q");
var request = require("browser-request");

var Auth = require("./auth.js");
var Schedule = require("./schedule.js");

function Compass(config) {
	if (!config || !config.url || !config.username || !config.password) throw new Error("Invalid config");

	this.promise = Q.defer();

	this.jar = request.jar();
	this.request = request.defaults({
		baseUrl: config.url,
		jar: this.jar
	});

	this.auth = new Auth(this.request, config.url, config.username, config.password);
	this.auth.promise
	.then(this.refresh)
	.then(this.promise.resolve)
	.done()
}

Compass.prototype.refresh = function() {
	var deferred = Q.defer();

	this.getSchedule()
	.then(deferred.resolve)
	.done();

	return deferred.promise;
}

Compass.prototype.getSchedule() {
	var deferred = Q.defer();

	//Get main page
	this.request("/", function(error, response, body) {
		if (!error && response.statusCode == 200) {
			this.schedule = new Schedule(body);
			deferred.resolve(this.schedule);
		} else {
			deferred.reject(error);
		}
	});

	return deferred.promise;
}

module.exports = Compass;