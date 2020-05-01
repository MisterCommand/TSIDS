var marquee = require('./marquee.js');
var date = require('date-and-time');

function timestamp() {
    let ts = new Date();
    ts = date.format(ts, 'YYYY/MM/DD HH:mm:ss');
    return ts;
}


var data = ["%version%","%rain%","%swr%","注意個人衛生 預防嚴重新型傳染性病原體呼吸系統病"];
marquee.update(data) // data = [string]
   .then(() => {
       console.log("信息滾動條更新（接收）" + " (" + timestamp() + ")");
   })
   .catch((error) => {
       console.log("信息滾動條更新（接收）錯誤 " + error + " (" + timestamp() + ")");
   }) 

marquee.get()
    .then((data) => { // data = [string]
        console.log("信息滾動條更新（發送）: " + data + " (" + timestamp() + ")");
    })
    .catch((error) => {
        console.log("信息滾動條更新（發送）錯誤: " + error + " (" + timestamp() + ")");
    })