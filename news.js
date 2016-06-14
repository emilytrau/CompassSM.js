"use strict";
const Q = require("q");
const cheerio = require("cheerio");
const moment = require("moment");

const ClassBase = require("./base.js");

class NewsItem {
	constructor(data) {
		this.title = data.Title;
		this.content = cheerio("<div>" + data.Content1 + "</div>").text();
		this.author = data.UserName;
		this.postTime = moment(data.PostDateTime, "DD\/MM\/YYYY - hh:mm a").clone().toDate();
	}
}

class News extends ClassBase {
	constructor(request) {
		super();

		this.request = request;
	}

	getNews(articles) {
		let deferred = Q.defer();

		this.request().post({
			url: "/Services/NewsFeed.svc/GetMyNewsFeedPaged?sessionstate=readonly",
			body: {
				activityId: null,
				start: 0,
				limit: articles || 10
			},
			json: true
		}, (error, response, body) => {
			let data = body.d.data;
			this.data = [];
			for (var i=0; i<data.length; i++) {
				this.data[i] = new NewsItem(data[i]);
			}

			deferred.resolve(this.data);
		});

		return deferred.promise;
	}
}

module.exports = News;