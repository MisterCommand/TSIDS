const mysql = require("mysql");
var request = require('request');
require('dotenv').config()

// MYSQL
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

var connect = function() {
    return new Promise((resolve, reject) => {
        connection.connect(function(error) {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        });
    })
}

var update = function() {
    return new Promise((resolve, reject) => {
        request(process.env.URL_ECLASS, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        });
    })
}

var fetchToday = function(today) { // today = YYYY-MM-DD
    return new Promise((resolve, reject) => {
        sql = "SELECT * FROM " + process.env.DB_TABLE + " WHERE end = '" + today + "'AND ( subject = '中國語文' OR subject = '英國語文' OR subject = '數學(必修部分)' OR subject = '通識' )";
        connection.query(sql, function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
                results = results.map((item) => {
                    item.start = new Date(item.start).toDateString();
                    item.end = new Date(item.end).toDateString();
                    return item
                })
                resolve(results)
            }
        })
    });
}

var fetchFuture = function(tmr, fd) { // tmr, fd = YYYY-MM-DD
    return new Promise((resolve, reject) => {
        sql = "SELECT * FROM " + process.env.DB_TABLE + " WHERE end BETWEEN '" + tmr + "' AND '" + fd + "' AND ( subject = '中國語文' OR subject = '英國語文' OR subject = '數學(必修部分)' OR subject = '通識' ) ORDER BY end ASC;";
        connection.query(sql, function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
                results = results.map((item) => {
                    item.start = new Date(item.start).toDateString();
                    item.end = new Date(item.end).toDateString();
                    return item
                })
                resolve(results)
            }
        })
    });
}

exports.connect = connect;
exports.update = update;
exports.fetchToday = fetchToday;
exports.fetchFuture = fetchFuture;