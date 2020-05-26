const request = require("request");
const cheerio = require("cheerio");

var newsList = [];

function news() {
    return new Promise((resolve, reject) => {
        request("http://news.tvb.com/list/instant", (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html) // Make it acts like JQuery
            
                $("body div.list_container.clearfix div.container.c1 div div:nth-child(1) div.dailyNews div").each((index, data) => { // For each row column
                    if (!$(data).find("a").text().includes("《") && !$(data).find("a").text().includes("[") && !$(data).find("a").text().includes("無綫") && $(data).find("a").text() != "") { // If text doesn't include 《 or [ or 無綫 and not empty
                    newsList.push($(data).find("a").text().replace("\n\t\t\n\t\t\t\t\t",''))
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