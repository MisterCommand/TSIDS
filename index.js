var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
require('dotenv').config()
var date = require('date-and-time');
var request = require('request');
var schedule = require('node-schedule');
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
  console.log("A new client connected" + " (" + timestamp() + ")");
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
  console.log("A client disconnected" + " (" + timestamp() + ")")
});



// Fetch RSS Temperature
function fetchTemp() {
  hko.temp()
    .then((data) => {
        console.log("溫度已更新：" + data + " (" + timestamp() + ")");
        io.sockets.emit('data', {type: "temperature", data: data + "°C"});
    })
    .catch((error) => {
      console.log("無法連接到香港天文台分區天氣API，部分功能可能受限。錯誤信息：" + error + " (" + timestamp() + ")");
    })
};

// Fetch Special Weather Reminder
var remind = ""; // Reminder
function fetchSpecialWeatherReminder() {
  hko.specialWeatherWarning()
    .then((data) => {
        remind = data;
        console.log("特別天氣提示："+data);
    })
    .catch((error) => {
        console.log("無法連接到香港天文台特別天氣提示API，部分功能可能受限。錯誤信息：" + error + " (" + timestamp() + ")");
    })
}

// Fetch RSS Warning
function fetchWarning() {
  hko.weatherWarning()
    .then((data) => {
      io.sockets.emit('data', {type: "warning", data: data});
      console.log("氣象警告已更新：" + data  + " (" + timestamp() + ")");
    })
    .catch((error) => {
      console.log("無法連接到香港天文台氣象警告，部分功能可能受限。錯誤信息：" + error + " (" + timestamp() + ")");
    })
};



// Connect to MariaDB
function connectDB() {
  homework.connect()
    .then(() => {
        console.log("數據庫連接成功" + " (" + timestamp() + ")")
  })
    .catch((error) => {
        console.log("數據庫連接失敗，部分功能可能受限。"+ " (" + timestamp() + ")")
  })
}


// Fetch eclass homework
var last_update = "";
function eclass() {
  homework.update()
    .then(() => {
        console.log("數據庫已更新" + " (" + timestamp() + ")");
        last_update = new Date;
        last_update = date.format(last_update, 'HH:mm:ss');
        io.sockets.emit("data", {type: "update", data: last_update});
        todayHW();
        futureHW();
    })
    .catch((error) => {
        console.log("無法連接更新服務" + error + " (" + timestamp() + ")")
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
        console.log("已更新今日功課" + " (" + timestamp() + ")")
    })
    .catch((error) => {
        console.log("無法更新今日功課" + error + " (" + timestamp() + ")")
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
        console.log("已更新未來功課" + " (" + timestamp() + ")")
    })
    .catch((error) => {
        console.log("無法更新未來功課：" + error + " (" + timestamp() + ")")
    })
};

// Fetch 彩雲天氣
var wMessage = "";
function CCWeather() {
  request(process.env.URL_CCWEATHER, function(error, response, body) {
    if (error) {
      console.log("無法連接彩雲天氣" + " (" + timestamp() + ")");
    } else {
      let content = JSON.parse(body);
      let pro30min = content.result.minutely.probability[0] * 100;
      let pro1h = content.result.minutely.probability[1] * 100;
      let pro1h30m = content.result.minutely.probability[2] * 100;
      let pro2h = content.result.minutely.probability[3] * 100;
      wMessage = "降雨概率：半小時：" + Math.round(pro30min) + "%   一小時：" + Math.round(pro1h) + "%   一個半小時：" + Math.round(pro1h30m) + "%   兩小時：" + Math.round(pro2h) + "%";
      console.log("降雨概率已更新" + " (" + timestamp() + ")");
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
  //   console.log("已獲取新聞" + " (" + timestamp() + ")")
  // })
  // .catch((error) => {
  //   console.log("無法獲取新聞：" + error + " (" + timestamp() + ")")
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
                console.log("特殊事件時間表更新（接收）" + " (" + timestamp() + ")");
            })
            .catch((error) => {
                console.log("特殊事件時間表更新（接收）錯誤 " + error + " (" + timestamp() + ")");
            })
        break
      
      case "array": // Array -> Marquee
        marquee.update(data.data) // data = [string]
          .then(() => {
              marqueeUpdate();
              console.log("信息滾動條更新（接收）" + " (" + timestamp() + ")");
          })
          .catch((error) => {
              console.log("信息滾動條更新（接收）錯誤 " + error + " (" + timestamp() + ")");
          })
        break
    }
  });
});

// File -> SOCKETIO
function fileJSON() {
  specialEvent.get()
    .then((data) => { // data = [{name: "", date: "YYYY-MM-DD", time: "HH:mm", duration: number}]
        console.log("特殊事件時間表更新（發送）" + " (" + timestamp() + ")");
        io.sockets.emit('data', {type: "specialEvent", data: data});
    })
    .catch((error) => {
        console.log("特殊事件時間表更新（接收）錯誤: " + error + " (" + timestamp() + ")");
    })
}

// Search every minute
function specialEventDetect() {
  specialEvent.detect(new Date())
  .then((data) => { // data = {name: "", date: "YYYY-MM-DD", time: "HH:mm", duration: number}
      if (data.status == "none") {
          // console.log("無特殊事件" + " (" + timestamp() + ")");
      } else if (data.status == "ended") {
          io.sockets.emit('event', {type: "specialEvent", data: {status: "ended"}});
          console.log("特殊事件已結束: " + data.name + " (" + timestamp() + ")");
      } else {
          io.sockets.emit('event', {type: "specialEvent", data: data});
          console.log("特殊事件: " + data.name + " (" + timestamp() + ")");
      }
  })
  .catch((error) => {
      console.log("特殊事件更新錯誤: " + error + " (" + timestamp() + ")");
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
      console.log("信息滾動條更新（發送）: " + data + " (" + timestamp() + ")");
  })
  .catch((error) => {
      console.log("信息滾動條更新（發送）錯誤: " + error + " (" + timestamp() + ")");
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
          console.log("信息滾動條已更新：" + data.join("          ")  + " (" + timestamp() + ")");
        }, 8000);
    })
    .catch((error) => {
        console.log("信息滾動條更新（發送）錯誤: " + error + " (" + timestamp() + ")");
    })
}

// ------------------------------------------------

async function check() {
  console.log("歡迎使用 TSIDS V" + version);
  console.log("開始自檢中");
  console.log("測試服務器數據庫連線");
  connectDB();
  console.log("測試天文台 RSS 連線");
  fetchTemp();
  fetchWarning();
  marqueeUpdate();
  app.listen(3000);
  setTimeout(function() {console.log("自檢完成，服務啓動完成")}, 3000)
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
  console.log("課程: " + currentClass + "(" + duration + ")" + " (" + timestamp() + ")");
};