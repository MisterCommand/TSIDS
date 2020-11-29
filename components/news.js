// Component: news
var date = require('date-and-time');
var request = require('request');

// Fetch RSS Temperature
var get = function() {
    return new Promise((resolve, reject) => {
        request("http://api.news.tvb.com/news/v2.2.1/entry?category=instant&date=" + date.format(new Date, 'YYYYMMDD'), function(error, response, body) {
            if (error) {
                reject(error);
            } else {
            let content = JSON.parse(body);
            let output = content.items.map((item) => {
                return "📰 " + item.title.replace("[現場]", "") // Extract news titles
            }); // Extract news title
            output = output.filter((item) => {
                return !item.includes("《") && !item.includes("[不斷更新]") // Remove some titles
            })
            resolve(output)
            };
        });
    })
};

// EXPORT
exports.get = get;