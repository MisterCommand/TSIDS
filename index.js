var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs');
require('dotenv').config()
var date = require('date-and-time');
var request = require('request');
var schedule = require('node-schedule');
const log = require('simple-node-logger').createSimpleLogger('log.log');
var hko = require('./components/hko.js'); // Component: hko
var homework = require('./components/homework.js'); // Component: homework
var specialEvent = require('./components/specialEvent.js'); // Component: specialEvent
var marquee = require('./components/marquee.js'); // Component: marquee
var scraper = require('./components/scraper.js'); // Component: scraper

// ------------------------------------------------

var version = "2.0";
var config = {
    components: {
        event: true,
        homework: true,
        weather: false, // HKO and CCWeather
        marquee: true,
		control: true,
		news: false
    },
    intervals: {
        event: 1800000,
        homework: 1800000,
        weather: 600000,
        marquee: 900000
    }
}

// ------------------------------------------------

// CHANNELS
// data: {type: "", data: ""}
// event: {type: "", data: ""}

// ------------------------------------------------



// Current timestamp
function timestamp() {
    let ts = new Date();
    ts = date.format(ts, 'YYYY/MM/DD HH:mm:ss');
    return ts;
}

// Date
function today() {
    let now = new Date()
    let today = date.format(now, 'YYYY-MM-DD');
    return today;
}

function tmr() {
    let now = new Date()
    let tmr = date.addDays(now, 1);
    tmr = date.format(tmr, 'YYYY-MM-DD');
    return tmr;
}

function fd() {
    let now = new Date()
    let fd = date.addDays(now, 14);
    fd = date.format(fd, 'YYYY-MM-DD');
    return fd;
}

// Express Static Files
app.use(express.static('public'));
// Configure Port Number
http.listen(3000, () => {
    log.info('監聽端口：3000');
});

var update = false;
var update_event;
var update_homework;
var update_weather;
var update_marquee;

// START - Set update intervals
function start() {
    if (!update) {
        if (config.components.event) {
            specialEventSend();
            update_event = setInterval(() => {
                specialEventSend();
            }, config.intervals.event)
        }
        if (config.components.homework) {
            eclass();
            update_homework = setInterval(() => {
                eclass();
            }, config.intervals.homework)
        }
        if (config.components.weather) {
            fetchTemp();
            fetchWarning();
            update_weather = setInterval(() => {
                fetchTemp();
                fetchWarning();
            }, config.intervals.weather)
        }
        if (config.components.marquee) {
            marqueeUpdate();
            update_marquee = setInterval(() => {
                marqueeUpdate();
            }, config.intervals.marquee)
        }
        if (config.components.control) {
            control(); // For control panel WIP
        }
        update = true;
    }
}

function stop() {
    if (update) {
        update = false;
        clearInterval(update_event);
        clearInterval(update_homework);
        clearInterval(update_weather);
        clearInterval(update_marquee);
    }
}

// Send connected message
io.sockets.on('connection', function(socket) {
    log.info("客戶端連接成功");
    start();
    socket.emit('server', {
        status: 'connected'
    });

    // Send disconnected message
    socket.on('disconnect', function() {
        log.info("客戶端斷開連接");
        stop();
        socket.emit('server', {
            status: 'disconnected'
        });
    });
});



// Fetch RSS Temperature
function fetchTemp() {
    hko.temp()
        .then((data) => {
            log.info("溫度已更新：" + data);
            io.sockets.emit('data', {
                type: "temperature",
                data: data + "°C"
            });
        })
        .catch((error) => {
            log.warn("無法連接到香港天文台分區天氣API，部分功能可能受限。錯誤信息：" + error);
        })
};

// Fetch Special Weather Reminder
function fetchSpecialWeatherReminder() {
    return new Promise((resolve) => {
		hko.specialWeatherWarning()
			.then((data) => {
				log.info("特別天氣提示：" + data);
				resolve(data)
			})
			.catch((error) => {
				log.warn("無法連接到香港天文台特別天氣提示API，部分功能可能受限。錯誤信息：" + error);
			})
	})
}

// Fetch RSS Warning
function fetchWarning() {
    hko.weatherWarning()
        .then((data) => {
            io.sockets.emit('data', {
                type: "warning",
                data: data
            });
            log.info("氣象警告已更新：" + data);
        })
        .catch((error) => {
            log.warn("無法連接到香港天文台氣象警告，部分功能可能受限。錯誤信息：" + error);
        })
};



// Fetch eclass homework
var last_update = "";

function eclass() {
    homework.update()
        .then(() => {
            log.info("數據庫已更新");
            last_update = new Date;
            last_update = date.format(last_update, 'HH:mm:ss');
            io.sockets.emit("data", {
                type: "update",
                data: last_update
            });
            todayHW();
            futureHW();
        })
        .catch((error) => {
            log.warn("無法連接更新服務" + error)
        })
};

// Fetch today homework
function todayHW() {
    homework.fetchToday(today())
        .then((results) => { // [All fields]
            io.sockets.emit('data', {
                type: "todayHW",
                data: results
            });
            log.info("已更新今日功課")
        })
        .catch((error) => {
            log.warn("無法更新今日功課" + error)
        })
};

// Fetcch future homework
function futureHW() {
    homework.fetchFuture(tmr(), fd())
        .then((results) => { // [All fields]
            io.sockets.emit('data', {
                type: "futureHW",
                data: results
            });
            log.info("已更新未來功課")
        })
        .catch((error) => {
            log.warn("無法更新未來功課：" + error)
        })
};

// Fetch 彩雲天氣
function CCWeather() {
    return new Promise((resolve) => {
        request(process.env.URL_CCWEATHER, function(error, response, body) {
            if (error) {
                log.warn("無法連接彩雲天氣");
                resolve("");
            } else {
                let content = JSON.parse(body);
                let pro30min = content.result.minutely.probability[0] * 100;
                let pro1h = content.result.minutely.probability[1] * 100;
                let pro1h30m = content.result.minutely.probability[2] * 100;
                let pro2h = content.result.minutely.probability[3] * 100;
                let output = ["降雨概率：", "半小時：" + Math.round(pro30min) + "%", "一小時：" + Math.round(pro1h) + "%", "一個半小時：" + Math.round(pro1h30m) + "%", "兩小時：" + Math.round(pro2h) + "%"];
                log.info("降雨概率已更新");
                resolve(output);
            };
        });
    })
}

// Fetch news
function fetchNews() {
    return new Promise((resolve) => {
		scraper.news()
			.then((data) => {
				log.info("已獲取新聞")
				resolve(data)
			})
			.catch((error) => {
				log.warn("無法獲取新聞：" + error)
			})
	})
}


// Special Events -> Client
function specialEventSend() {
    specialEvent.get()
        .then((data) => { // data = [{type: "", subject: "", start: "DD/MM/YYYY HH:MM, endd: "DD/MM/YYYY HH:MM"}]
            log.info("特殊事件時間表更新");
            io.sockets.emit('data', {
                type: "specialEvent",
                data: data
            });
        })
        .catch((error) => {
            log.warn("特殊事件時間表更新錯誤: " + error);
        })
}

// ------------------------------------------------
// CONTROL PANEL
// Special event

io.sockets.on('connection', function(socket) {
    socket.on('data', function(data) {
        switch (data.type) {
            case "specialEvent": // SOCKETIO -> File
                specialEvent.update(data.data) // data = [{name: "", date: "YYYY-MM-DD", time: "HH:mm", duration: number}]
                    .then(() => {
                        log.info("特殊事件時間表更新（接收）");
                    })
                    .catch((error) => {
                        log.warn("特殊事件時間表更新（接收）錯誤 " + error);
                    })
                break

            case "array": // Array -> Marquee
                marquee.update(data.data) // data = [string]
                    .then(() => {
                        marqueeUpdate();
                        log.info("信息滾動條更新（接收）");
                    })
                    .catch((error) => {
                        log.warn("信息滾動條更新（接收）錯誤 " + error);
                    })
                break
        }
    });
});

// WIP
// Special Event and Marquee -> Control Panel
function control() {
    marquee.get()
        .then((data) => { // data = [string]
            io.sockets.emit('data', {
                type: "array",
                data: data
            });
            log.info("管理面板（發送）: " + data);
        })
        .catch((error) => {
            log.warn("管理面板（發送）錯誤: " + error);
        })
}

// Marquee -> Client
async function marqueeUpdate() {
	let data = await marquee.get();
	// Check enabled -> replace content
	if (data.includes("%version%")) {
		data[data.indexOf("%version%")] = "TSIDS V" + version
	}
	if (data.includes("%rain%")) {
		if (config.components.weather) { // If enabled
			data[data.indexOf("%rain%")] = await CCWeather()
		} else {
			data.splice(data.indexOf("%rain%"), 1) // Remove this element
		}
	}
	if (data.includes("%swr%")) {
		if (config.components.weather) {
			data[data.indexOf("%swr%")] = await fetchSpecialWeatherReminder();
		} else {
			data.splice(data.indexOf("%swr%"), 1)
		}
	}
	if (data.includes("%news%")) {
		if (config.components.news) {
			data[data.indexOf("%news%")] = await fetchNews();
		} else {
			data.splice(data.indexOf("%news%"), 1)
		}
	}
	io.sockets.emit('data', {
		type: "marquee",
		data: data
	});
	log.info("信息滾動條已更新：" + data);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------------

// Time Cycle

// Eclass Fetch
var eclass_update_after_school = schedule.scheduleJob("0 */12 * * *", function() { // Every 12 hour
    eclass();
});