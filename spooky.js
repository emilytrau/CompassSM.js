var Q = require("q");
var Spooky = require("spooky");

function s(url) {
	var deferred = Q.defer();
	this.promise = deferred.promise;

	this.url = url;

	this.spooky = new Spooky({
		child: {
			transport: "http"
		}
	}, function(err) {
		if (err) {
	        e = new Error('Failed to initialize SpookyJS');
	        e.details = err;
	        throw e;
	    }

	    this.spooky.start(this.url);
	    this.spooky.then(deferred.resolve)

	    this.spooky.run();
	});
}

module.exports = s;