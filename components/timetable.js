var lessons = {
    1: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "B3", start: "8:30", end: "9:40", duration: 70},
        {type: "recess", NextSubject: "Math.", start: "9:40", end: "9:55", duration: 15},
        {type: "class", subject: "Math.", start: "9:55", end: "10:30", duration: 35},
        {type: "class", subject: "中文", start: "10:30", end: "11:05", duration: 35},
        {type: "recess", NextSubject: "B1", start: "11:05", end: "11:20", duration: 15},
        {type: "class", subject: "B1", start: "11:20", end: "12:30", duration: 70},
        {type: "class", subject: "PE", start: "12:30", end: "13:05", duration: 35},
        {type: "end", start: "13:05"}
    ],
    2: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "B3", start: "8:30", end: "9:40", duration: 70},
        {type: "recess", NextSubject: "Math.", start: "9:40", end: "9:55", duration: 15},
        {type: "class", subject: "Math.", start: "9:55", end: "11:05", duration: 70},
        {type: "recess", NextSubject: "中文", start: "11:05", end: "11:20", duration: 15},
        {type: "class", subject: "中文", start: "11:20", end: "12:30", duration: 70},
        {type: "class", subject: "B2", start: "12:30", end: "13:05", duration: 35},
        {type: "end", start: "13:05"}
    ],
    3: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "Math.", start: "8:30", end: "9:40", duration: 70},
        {type: "recess", NextSubject: "English", start: "9:40", end: "9:55", duration: 15},
        {type: "class", subject: "English", start: "9:55", end: "11:05", duration: 70},
        {type: "recess", NextSubject: "通識", start: "11:05", end: "11:20", duration: 15},
        {type: "class", subject: "通識", start: "11:20", end: "12:30", duration: 70},
        {type: "class", subject: "B1", start: "12:30", end: "13:05", duration: 35},
        {type: "end", start: "13:05"}
    ],
    4: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "B1", start: "8:30", end: "9:40", duration: 70},
        {type: "recess", NextSubject: "中文", start: "9:40", end: "9:55", duration: 15},
        {type: "class", subject: "中文", start: "9:55", end: "11:05", duration: 70},
        {type: "recess", NextSubject: "English", start: "11:05", end: "11:20", duration: 15},
        {type: "class", subject: "English", start: "11:20", end: "12:30", duration: 70},
        {type: "class", subject: "B3", start: "12:30", end: "13:05", duration: 35},
        {type: "end", start: "13:05"}
    ],
    5: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "B2", start: "8:30", end: "9:40", duration: 70},
        {type: "recess", NextSubject: "通識", start: "9:40", end: "9:55", duration: 15},
        {type: "class", subject: "通識", start: "9:55", end: "11:05", duration: 70},
        {type: "recess", NextSubject: "中文", start: "11:05", end: "11:20", duration: 15},
        {type: "class", subject: "中文", start: "11:20", end: "11:30", duration: 70},
        {type: "class", subject: "CT", start: "11:55", end: "12:25", duration: 35},
        {type: "class", subject: "Math.", start: "12:30", end: "13:05", duration: 35},
        {type: "end", start: "13:05"}
    ],
}

function detect(time) { // Return lesson object
    var weekday = time.getDay();
    var hour = time.getHours();
    var minute = time.getMinutes();
    if (weekday > 0 && weekday < 6) { // Weekday is between Monday and Friday
        var match = lessons[weekday].some((value) => { // Check start time matched
            return value.start.split(":")[0] == hour && value.start.split(":")[1] == minute
        })
        if (match) {
            return lessons[weekday].find((value) => {
                return value.start.split(":")[0] == hour && value.start.split(":")[1] == minute
            })
        } else if (hour <= lessons[weekday][0].start.split(":")[0] && minute <= lessons[weekday][0].start.split(":")[1]) { // Check time is before school start
            return lessons[weekday][0]
        } else {
            return false
        }
    } else {
        return false
    }
}

function get() {
    return lessons
}

exports.detect = detect;
exports.get = get;