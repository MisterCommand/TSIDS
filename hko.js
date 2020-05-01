// Component: hko
var date = require('date-and-time');
var request = require('request');
var feed = require("feed-read-parser");

// Fetch RSS Temperature
var temp = function() {
    return new Promise((resolve, reject) => {
        request("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc", function(error, response, body) {
            if (error) {
                reject(error);
            } else {
            let content = JSON.parse(body);
            let temps = content.temperature.data; // Array of all temperatures
            temps.forEach(element => {
                if (element.place == "沙田") {
                    resolve(element.value)
                }
            });
            };
        });
    })
};

// Fetch Special Weather Reminder
var remind = ""; // Reminder
var specialWeatherWarning = function() {
    return new Promise((resolve, reject) => {
        request("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=swt&lang=tc", function(error, response, body) {
            if (error) {
                reject(error);
            } else {
            let content = JSON.parse(body);
            let reminds = content.swt; // Array of all special reminders
            if (reminds.length > 0) {
                reminds.forEach(element => {
                remind = remind + " " + element["desc"];
                });
                resolve(remind);
            } else {
                remind = "無特別天氣提示";
                resolve("無特別天氣提示");
            }
            };
        });
    });
}
  
// Fetch RSS Warning
var weatherWarning = function() {
    return new Promise((resolve, reject) => {
        feed("https://rss.weather.gov.hk/rss/WeatherWarningSummaryv2_uc.xml", function(err, xml) {
            if (err) {
                reject(err);
            } else {
                let content = "";
                for (var i in xml) {
                content += xml[i]["content"].replace(/<br\/\>/g, "").replace(/\(.*?\)/, "").replace(/ /g,'');
                //console.log(content);
                }
                let warning = content.split("。");
                warning = warning.filter(Boolean);
                for (i = 0; i < warning.length; i++) {
                if (warning[i].includes("取消")) {
                    warning.splice(i, 1)
                } else {
                    warning[i] = warning[i].replace(/在.*?出/g, '')
                }
                }
                resolve(warning)
            };
            //let warning = "黃色火災危險警告在09時45分發出( 2018年12月2日 )。 <br/><br/>黃色暴雨警告在09時45分發出( 2018年12月2日 )。 <br/><br/>十號颶風信號在09時45分取消( 2018年12月2日 )。 <br/><br/>";
            //warning = warning.replace(/<br\/\>/g, '').replace(/\(.*?\)/g, "").replace(/ /g, "").split("。");
        });
    })
};

// EXPORT
exports.temp = temp;
exports.specialWeatherWarning = specialWeatherWarning;
exports.weatherWarning = weatherWarning;