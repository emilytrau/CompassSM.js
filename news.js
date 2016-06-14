"use strict";
const Q = require("q");
const cheerio = require("cheerio");
const moment = require("moment");

const ClassBase = require("./base.js");

class Attachment {
	constructor(data, request) {
		this.name = data.name;
		this.isImage = data.IsImage;
		this.request = request;

		if (this.isImage) {
			this.url = "/ImageDownload/1/" + data.AssetId;
		} else {
			this.url = "/Services/FileDownload/FileRequestHandler?FileDownloadType=1&file=" + data.AssetId;
		}
	}

	download(stream) {
		this.request()(this.url).pipe(stream);
	}
}

class NewsItem {
	constructor(data, request) {
		this.title = data.Title;
		this.content = cheerio("<div>" + data.Content1 + "</div>").text();
		this.author = data.UserName;
		this.postTime = moment(data.PostDateTime, "DD\/MM\/YYYY - hh:mm a").clone().toDate();

		this.attachments = [];
		if (data.Attachments.length > 0) {
			for (var i=1; i<data.Attachments.length; i++) {
				this.attachments.push(new Attachment(data.Attachments[i], request));
			}
		}
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
				this.data[i] = new NewsItem(data[i], this.request);
			}

			deferred.resolve(this.data);
		});

		return deferred.promise;
	}
}

module.exports = News;