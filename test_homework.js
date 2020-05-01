var homework = require('./homework.js');
var date = require('date-and-time');
var last_update = "";

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

homework.connect()
    .then(() => {
        console.log("數據庫連接成功" + " (" + timestamp() + ")")
    })
    .catch((error) => {
        console.log("數據庫連接失敗，部分功能可能受限: " + error + " (" + timestamp() + ")")
    })

homework.update()
    .then(() => {
        console.log("數據庫已更新" + " (" + timestamp() + ")");
        last_update = new Date;
        last_update = date.format(last_update, 'HH:mm:ss');
        //io.sockets.emit("update", last_update);
    })
    .catch((error) => {
        console.log("無法連接更新服務: " + error + " (" + timestamp() + ")")
    })

homework.fetchToday(today())
    .then((results) => {
        let data = {
            subject: results.map((value) => { return value.subject }),
            title: results.map((value) => { return value.title }),
            submit: results.map((value) => { return value.submit })
        };
        console.log(data);
        //io.sockets.emit('todayHW', data);
        console.log("已更新今日功課" + " (" + timestamp() + ")")
    })
    .catch((error) => {
        console.log("無法更新今日功課: " + error + " (" + timestamp() + ")")
    })

homework.fetchFuture(tmr(), fd())
    .then((results) => {
        let data = {
            subject: results.map((value) => { return value.subject }),
            title: results.map((value) => { return value.title }),
            end: results.map((value) => { return date.format(value.end, 'YYYY-MM-DD') }),
            submit: results.map((value) => { return value.submit })
        };
        console.log(data);
        //io.sockets.emit('futureHW', data);
        console.log("已更新未來功課" + " (" + timestamp() + ")")
    })
    .catch((error) => {
        console.log("無法更新未來功課: " + error + " (" + timestamp() + ")")
    })