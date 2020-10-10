var date = require('date-and-time');
var fs = require('fs');
var file = "Special_Events.txt";


var get = function() {
    return new Promise((resolve, reject) => {
        fs.readFile(file, function(error, data) {
            if (error) {
                reject(error)
            } else {
                resolve(JSON.parse(data))
            }
        })
    })
}

// NOT IN USE
var detect = function(now) { // now = date object
    return new Promise((resolve, reject) => {
        let d = date.format(now, 'YYYY-MM-DD');
        let t = date.format(now, "HH:mm");
        fs.readFile(file, function(error, data) {
            if (error) {
                reject(error)
            } else {
                data = JSON.parse(data);
                let result = {};
                data.forEach(item => {
                   
                    if (item.date == d && item.time == t) { // Event starting now
                        result = item
                    } else if (date.subtract(now, new Date (item.date + " " + item.time)).toMinutes() < item.duration) { // Event happening
                        result = item
                    } else if (date.subtract(now, new Date (item.date + " " + item.time)).toMinutes() == item.duration) { // Event ended
                        result = {status: "ended", name: item.name}
                    } else { // No event
                        result = {status: "none"}
                    }
                   
                });
                resolve(result)
            }
        })
    })
}

var update = function(data) { // data = [{event: "", date: "YYYY-MM-DD", time: "HH:mm", duration: number}]
    return new Promise((resolve, reject) => {
        fs.writeFile(file, JSON.stringify(data), function(error) {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        });
    })
}



exports.get = get;
exports.detect = detect;
exports.update = update;