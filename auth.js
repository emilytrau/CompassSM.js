var Q = require("q");
var cheerio = require("cheerio");

function Auth(request, url, username, password) {
	this.url = url;
	this.username = username;
	this.password = password;

	this.request = request;

	this.promise = this.reauth();
}

Auth.prototype.reauth = function() {
	var deferred = Q.defer();

	this.getSessionCookie()
	.then(this.login)
	.then(function() {
		this.request("/", function(error, response, body) {
			console.log(body);
		})
	})

	return deferred.promise;
}

Auth.prototype.getSessionCookie = function() {
	var deferred = Q.defer();

	var options = {
		uri: "/"
	}
	this.request.get(options, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			deferred.resolve(body)
		} else {
			deferred.reject(error);
		}
	});

	return deferred.promise;
}

Auth.prototype.login = function(body) {
	var deferred = Q.defer();

	var $ = cheerio.load(body);

	var form = $("#form_of_login");

	var formOptions = {
		"__VIEWSTATE": form.find("#__VIEWSTATE").val(),
		"username": compass.username,
		"password": compass.password,
		"button1": "Sign in",
		"__VIEWSTATEGENERATOR": form.find("#__VIEWSTATEGENERATOR").val()
	}

	var options = {
		uri: "login.aspx"
	}
	this.request.post(options, {form: formOptions}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			deferred.resolve();
		} else {
			deferred.reject(error);
		}
	});

	return deferred.promise();
}

module.exports = Auth;