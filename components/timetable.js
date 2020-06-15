var lessons = {
    1: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "中文", start: "8:25", end: "9:25", duration: 60},
        {type: "recess", NextSubject: "B1", start: "9:25", end: "9:35", duration: 10},
        {type: "class", subject: "B1", start: "9:35", end: "10:35", duration: 60},
        {type: "recess", NextSubject: "通識", start: "10:35", end: "10:45", duration: 10},
        {type: "class", subject: "通識", start: "10:45", end: "11:45", duration: 60},
        {type: "recess", NextSubject: "Math.", start: "11:45", end: "11:55", duration: 10},
        {type: "class", subject: "Math.", start: "11:55", end: "12:25", duration: 30},
        {type: "class", subject: "PE", start: "12:25", end: "12:55", duration: 30},
        {type: "end", start: "12:55"},
    ],
    2: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "B2", start: "8:25", end: "9:25", duration: 60},
        {type: "recess", NextSubject: "通識", start: "9:25", end: "9:35", duration: 10},
        {type: "class", subject: "通識", start: "9:35", end: "10:35", duration: 60},
        {type: "recess", NextSubject: "B3", start: "10:35", end: "10:45", duration: 10},
        {type: "class", subject: "B3", start: "10:45", end: "11:45", duration: 60},
        {type: "recess", NextSubject: "Math.", start: "11:45", end: "11:55", duration: 10},
        {type: "class", subject: "Math.", start: "11:55", end: "12:25", duration: 30},
        {type: "class", subject: "English", start: "12:25", end: "12:55", duration: 30},
        {type: "end", start: "12:55"},
    ],
    3: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "B2", start: "8:25", end: "9:25", duration: 60},
        {type: "recess", NextSubject: "B1", start: "9:25", end: "9:35", duration: 10},
        {type: "class", subject: "B1", start: "9:35", end: "10:35", duration: 60},
        {type: "recess", NextSubject: "English", start: "10:35", end: "10:45", duration: 10},
        {type: "class", subject: "English", start: "10:45", end: "11:45", duration: 60},
        {type: "recess", NextSubject: "中文", start: "11:45", end: "11:55", duration: 10},
        {type: "class", subject: "中文", start: "11:55", end: "12:25", duration: 30},
        {type: "class", subject: "通識", start: "12:25", end: "12:55", duration: 30},
        {type: "end", start: "12:55"},
    ],
    4: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "B3", start: "8:25", end: "9:25", duration: 60},
        {type: "recess", NextSubject: "English", start: "9:25", end: "9:35", duration: 10},
        {type: "class", subject: "English", start: "9:35", end: "10:35", duration: 60},
        {type: "recess", NextSubject: "Math.", start: "10:35", end: "10:45", duration: 10},
        {type: "class", subject: "Math.", start: "10:45", end: "11:45", duration: 60},
        {type: "recess", NextSubject: "B1", start: "11:45", end: "11:55", duration: 10},
        {type: "class", subject: "B1", start: "11:55", end: "12:25", duration: 30},
        {type: "class", subject: "中文", start: "12:25", end: "12:55", duration: 30},
        {type: "end", start: "12:55"},
    ],
    5: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "中文", start: "8:25", end: "9:25", duration: 60},
        {type: "recess", NextSubject: "English", start: "9:25", end: "9:35", duration: 10},
        {type: "class", subject: "English", start: "9:35", end: "10:35", duration: 60},
        {type: "recess", NextSubject: "Math.", start: "10:35", end: "10:45", duration: 10},
        {type: "class", subject: "Math.", start: "10:45", end: "11:45", duration: 60},
        {type: "recess", NextSubject: "B3", start: "11:45", end: "11:55", duration: 10},
        {type: "class", subject: "B3", start: "11:55", end: "12:25", duration: 30},
        {type: "class", subject: "B2", start: "12:25", end: "12:55", duration: 30},
        {type: "end", start: "12:55"},
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

exports.detect = detect;