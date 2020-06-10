var app = require('http').createServer(handler)
var io = require('socket.io')(app);
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
var timetable = require('./components/timetable.js'); // Component: timetable

// ------------------------------------------------

var version = "1.6";

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

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
};

// Send connected message
io.sockets.on('connection', function (socket) {
  log.info("A new client connected");
  fetchTemp();
  fetchWarning();
  eclass();
  fileJSON();
  marqueeArray()
  marqueeUpdate();
  setInterval(fetchTemp, 600000); // Update per 10 mins
  setInterval(fetchWarning, 600000); // Update per 10 mins
  setInterval(marqueeUpdate, 900000); // Update per 15 mins
  socket.emit('server', { status: 'connected' });
});

// Send disconnected message
io.sockets.on('disconnect', function (socket) {
  socket.emit('server', { status: 'disconnected' });
  log.info("A client disconnected")
});



// Fetch RSS Temperature
function fetchTemp() {
  hko.temp()
    .then((data) => {
        log.info("溫度已更新：" + data);
        io.sockets.emit('data', {type: "temperature", data: data + "°C"});
    })
    .catch((error) => {
      log.info("無法連接到香港天文台分區天氣API，部分功能可能受限。錯誤信息：" + error);
    })
};

// Fetch Special Weather Reminder
var remind = ""; // Reminder
function fetchSpecialWeatherReminder() {
  hko.specialWeatherWarning()
    .then((data) => {
        remind = data;
        log.info("特別天氣提示："+data);
    })
    .catch((error) => {
        log.info("無法連接到香港天文台特別天氣提示API，部分功能可能受限。錯誤信息：" + error);
    })
}

// Fetch RSS Warning
function fetchWarning() {
  hko.weatherWarning()
    .then((data) => {
      io.sockets.emit('data', {type: "warning", data: data});
      log.info("氣象警告已更新：" + data );
    })
    .catch((error) => {
      log.info("無法連接到香港天文台氣象警告，部分功能可能受限。錯誤信息：" + error);
    })
};



// Connect to MariaDB
function connectDB() {
  homework.connect()
    .then(() => {
        log.info("數據庫連接成功")
  })
    .catch((error) => {
        log.info("數據庫連接失敗，部分功能可能受限。"+ " (" + timestamp() + ")")
  })
}


// Fetch eclass homework
var last_update = "";
function eclass() {
  homework.update()
    .then(() => {
        log.info("數據庫已更新");
        last_update = new Date;
        last_update = date.format(last_update, 'HH:mm:ss');
        io.sockets.emit("data", {type: "update", data: last_update});
        todayHW();
        futureHW();
    })
    .catch((error) => {
        log.info("無法連接更新服務" + error)
    })
};

// Fetch today homework
function todayHW() {
  homework.fetchToday(today())
    .then((results) => { // [All fields]
        let data = {
            subject: results.map((value) => { return value.subject }),
            title: results.map((value) => { return value.title }),
            submit: results.map((value) => { return value.submit })
        };
        io.sockets.emit('data', {type: "todayHW", data: data});
        log.info("已更新今日功課")
    })
    .catch((error) => {
        log.info("無法更新今日功課" + error)
    })
};

// Fetcch future homework
function futureHW() {
  homework.fetchFuture(tmr(), fd())
    .then((results) => { // [All fields]
        let data = {
            subject: results.map((value) => { return value.subject }),
            title: results.map((value) => { return value.title }),
            end: results.map((value) => { return date.format(value.end, 'YYYY-MM-DD') }),
            submit: results.map((value) => { return value.submit })
        };
        io.sockets.emit('data', {type: "futureHW", data: data});
        log.info("已更新未來功課")
    })
    .catch((error) => {
        log.info("無法更新未來功課：" + error)
    })
};

// Fetch 彩雲天氣
var wMessage = "";
function CCWeather() {
  request(process.env.URL_CCWEATHER, function(error, response, body) {
    if (error) {
      log.info("無法連接彩雲天氣");
    } else {
      let content = JSON.parse(body);
      let pro30min = content.result.minutely.probability[0] * 100;
      let pro1h = content.result.minutely.probability[1] * 100;
      let pro1h30m = content.result.minutely.probability[2] * 100;
      let pro2h = content.result.minutely.probability[3] * 100;
      wMessage = "降雨概率：半小時：" + Math.round(pro30min) + "%   一小時：" + Math.round(pro1h) + "%   一個半小時：" + Math.round(pro1h30m) + "%   兩小時：" + Math.round(pro2h) + "%";
      log.info("降雨概率已更新");
      return wMessage;
    };
  });
}

// Fetch news
var news = [];
function fetchNews() {
  // scraper.news()
  // .then((data) => {
  //   news = data;
  //   log.info("已獲取新聞")
  // })
  // .catch((error) => {
  //   log.info("無法獲取新聞：" + error)
  // })
}

// ------------------------------------------------
// CONTROL PANEL
// Special event

io.sockets.on('connection', function (socket) {
  socket.on('data', function (data) {
    switch (data.type) {
      case "specialEvent": // SOCKETIO -> File
          specialEvent.update(data.data) // data = [{name: "", date: "YYYY-MM-DD", time: "HH:mm", duration: number}]
            .then(() => {
                log.info("特殊事件時間表更新（接收）");
            })
            .catch((error) => {
                log.info("特殊事件時間表更新（接收）錯誤 " + error);
            })
        break
      
      case "array": // Array -> Marquee
        marquee.update(data.data) // data = [string]
          .then(() => {
              marqueeUpdate();
              log.info("信息滾動條更新（接收）");
          })
          .catch((error) => {
              log.info("信息滾動條更新（接收）錯誤 " + error);
          })
        break
    }
  });
});

// File -> SOCKETIO
function fileJSON() {
  specialEvent.get()
    .then((data) => { // data = [{name: "", date: "YYYY-MM-DD", time: "HH:mm", duration: number}]
        log.info("特殊事件時間表更新（發送）");
        io.sockets.emit('data', {type: "specialEvent", data: data});
    })
    .catch((error) => {
        log.info("特殊事件時間表更新（接收）錯誤: " + error);
    })
}

// Search every minute
function specialEventDetect() {
  specialEvent.detect(new Date())
  .then((data) => { // data = {name: "", date: "YYYY-MM-DD", time: "HH:mm", duration: number}
      if (data.status == "none") {
          // log.info("無特殊事件");
      } else if (data.status == "ended") {
          io.sockets.emit('event', {type: "specialEvent", data: {status: "ended"}});
          log.info("特殊事件已結束: " + data.name);
      } else {
          io.sockets.emit('event', {type: "specialEvent", data: data});
          log.info("特殊事件: " + data.name);
      }
  })
  .catch((error) => {
      log.info("特殊事件更新錯誤: " + error);
  })
}

// Detect currect lesson
function classDetect() {
  if (timetable.detect(new Date) != false) {
    if (timetable.detect(new Date).type == "class") {
      startClass(timetable.detect(new Date).subject, timetable.detect(new Date).duration)
    } else if (timetable.detect(new Date).type == "recess") {
      recess((timetable.detect(new Date).NextClass))
    } else if (timetable.detect(new Date).type == "start") {
      ct()
    } else if (timetable.detect(new Date).type == "end") {
      recess("");
    }
  }
}

// Marquee -> Array
var marqueeItem = [];
function marqueeArray() {
  marquee.get()
  .then((data) => { // data = [string]
      io.sockets.emit('data', {type: "array", data: data});
      log.info("信息滾動條更新（發送）: " + data);
  })
  .catch((error) => {
      log.info("信息滾動條更新（發送）錯誤: " + error);
  })
}

// Structure marquee
function marqueeUpdate() {
  marquee.get()
    .then((data) => { // data = [string]
        data = data.map((value) => {
          if (value == "%version%") {
            return "TSIDS V" + version
          } else if (value == "%rain%") {
            CCWeather();
            setTimeout(() => {data[data.findIndex(value => value == "%rain%")] = wMessage;}, 3000);
            return value
          } else if (value == "%swr%") {
            fetchSpecialWeatherReminder();
            setTimeout(() => {data[data.findIndex(value => value == "%swr%")] = remind;}, 3000);
            return value
          } else if (value == "%news%") {
            fetchNews();
            setTimeout(() => {data[data.findIndex(value => value == "%news%")] = news.join(" 🌐 ");}, 3000);
            return value
          } else {
            return value
          }
        })
        setTimeout(function () {
          io.sockets.emit('data', {type: "marquee", data: data.join("          ")});
          log.info("信息滾動條已更新：" + data.join("          ") );
        }, 8000);
    })
    .catch((error) => {
        log.info("信息滾動條更新（發送）錯誤: " + error);
    })
}

// ------------------------------------------------

async function check() {
  log.info("歡迎使用 TSIDS V" + version);
  log.info("開始自檢中");
  log.info("測試服務器數據庫連線");
  connectDB();
  log.info("測試天文台 RSS 連線");
  fetchTemp();
  fetchWarning();
  marqueeUpdate();
  app.listen(3000);
  setTimeout(function() {log.info("自檢完成，服務啓動完成")}, 3000)
}
check();

// -------------------------------------------------------------------------------------------------------------------------------------------------------------

// Time Cycle

// Eclass Fetch
var eclass_update_school = schedule.scheduleJob("*/40 9-16 * * 1-5", function(){
  eclass();
});
var eclass_update_after_school = schedule.scheduleJob("0 17-23/6 * * 1-5", function(){
  eclass();
});
var eclass_update_before_school = schedule.scheduleJob("0 0-8/6 * * 1-5", function(){
  eclass();
});
var eclass_update_weekend = schedule.scheduleJob("0 0-23/12 * * 6-7", function(){
  eclass();
});

// Apply to all
var every_minute = schedule.scheduleJob("* * * * *", function(){
  specialEventDetect();
  classDetect();
});

// time: {type: "before_school"/"recess"/"class", nextClass/currentClass: "", duration: 80/40}
function ct() {
  io.sockets.emit('event', {type: "before_school"});
};
function recess(nextClass) {
  io.sockets.emit('event', {type: "recess", data: {nextClass: nextClass}});
};
function startClass(currentClass, duration) {
  io.sockets.emit('event', {type: "class", data: {currentClass: currentClass, duration: duration}});
  log.info("課程: " + currentClass + "(" + duration + ")");
};