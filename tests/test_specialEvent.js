var specialEvent = require('../components/specialEvent.js');
var date = require('date-and-time');

function timestamp() {
    let ts = new Date();
    ts = date.format(ts, 'YYYY/MM/DD HH:mm:ss');
    return ts;
}


//var data = [{name: "1010EVENT", date: "2020-04-21", time: "10:10", duration: 10}];
// specialEvent.update(data) // data = [{name: "", date: "YYYY-MM-DD", time: "HH:mm", duration: number}]
//     .then(() => {
//         console.log("特殊事件時間表更新（接收）" + " (" + timestamp() + ")");
//     })
//     .catch((error) => {
//         console.log("特殊事件時間表更新（接收）錯誤 " + error + " (" + timestamp() + ")");
//     })

specialEvent.get()
    .then((data) => { // data = [{name: "", date: "YYYY-MM-DD", time: "HH:mm", duration: number}]
        console.log("特殊事件時間表更新（發送）" + " (" + timestamp() + ")");
    })
    .catch((error) => {
        console.log("特殊事件時間表更新（發送）錯誤: " + error + " (" + timestamp() + ")");
    })

// specialEvent.detect(new Date())
//     .then((data) => { // data = {name: "", date: "YYYY-MM-DD", time: "HH:mm", duration: number}
//         if (data.status == "none") {
//             console.log("無特殊事件" + " (" + timestamp() + ")");
//         } else if (data.status == "ended") {
//             console.log("特殊事件已結束: " + data.name + " (" + timestamp() + ")");
//         } else {
//             console.log("特殊事件: " + data.name + " (" + timestamp() + ")");
//         }
//     })
//     .catch((error) => {
//         console.log("特殊事件更新錯誤: " + error + " (" + timestamp() + ")");
//     })