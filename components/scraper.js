const request = require("request");
const cheerio = require("cheerio");

var newsList = [];

function news() {
    return new Promise((resolve, reject) => {
        request("http://news.tvb.com/list/instant", (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html) // Make it acts like JQuery
                newsList = [];
                $("body div.list_container.clearfix div.container.c1 div div:nth-child(1) div.dailyNews div").each((index, data) => { // For each row column
                    let text = $(data).find("a").text();
                    if (!text.includes("《") && !text.includes("[不斷更新]") && !text.includes("[現場]") && !text.includes("無綫") && text != "") { // If text doesn't include 《 or [ or 無綫 or [不斷更新] or [現場]and not empty
                    newsList.push(text.replace("\n\t\t\n\t\t\t\t\t",''))
                    }
                })
                resolve(newsList)
            } else {
                reject(error)
            }
        })
    })
}

exports.news = news;