var date = require('date-and-time');
var fs = require('fs');
var file = "../Marquee.txt";


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

var update = function(data) { // data = [string]
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
exports.update = update;