const striptags = require("striptags");

class Attachment {
    constructor(auth, data) {
        this.auth = auth;
        this.id = data.AssetId;
        this.name = data.Name;
        this.path = `/Services/FileDownload/FileRequestHandler?FileDownloadType=1&file=${this.id}`;
    }

    async download() {
        let [body, res] = await this.auth.async_request(path, {
            encoding: null // Return a buffer
        });
        
        if (res.statusCode != 200) {
            throw new Error("Error downloading attachment. Invalid status code " + res.statusCode);
        }

        return body;
    }
}

class User {
    constructor(auth, data) {
        this.auth = auth;
        this.id = data.UserId;
        this.name = data.UserName;
        this.imagepath = data.UserImageUrl;
    }

    async downloadImage() {
        try {
            let [body, res] = await this.auth.async_request(this.imagepath, {
                encoding: null // Return a buffer
            });
            
            if (res.statusCode != 200) {
                throw new Error("Error downloading image. Invalid status code " + res.statusCode);
            }

            return body;
        } catch (e) {
            throw e;
        }
    }
}

class NewsItem {
    constructor(auth, data) {
        this.id = data.NewsItemId;
        this.title = data.Title;
        this.content = striptags(data.Content1);
        this.postTime = new Date(data.PostDateTime);
        this.user = new User(auth, data);

        this.attachments = [];
        data.Attachments.forEach((item) => {
            this.attachments.push(new Attachment(auth, item));
        }, this)
    }
}

module.exports = class News {
    constructor(auth) {
        this.auth = auth;
    }

    async get(start = 0, limit = 10) {
        try {
            let [body, res] = await this.auth.async_request("/Services/NewsFeed.svc/GetMyNewsFeedPaged", {
                method: "POST",
                qs: {
                    "sessionstate": "readonly"
                },
                json: {
                    activityId: null,
                    limit: limit.toString(),
                    start: start.toString()
                }
            });

            if (res.statusCode != 200) {
                throw new Error("Error fetching news feed. Invalid status code " + res.statusCode);
            }

            let newsitems = [];
            body.d.data.forEach((item) => {
                newsitems.push(new NewsItem(this.auth, item));
            }, this);
            return newsitems;
        } catch(e) {
            throw e;
        }
    }
}