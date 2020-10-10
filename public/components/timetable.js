var lessons = {
    1: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "B3", start: "8:30", end: "9:40"},
        {type: "recess", NextSubject: "Mathematics", start: "9:40", end: "9:55"},
        {type: "class", subject: "Mathematics", start: "9:55", end: "10:30"},
        {type: "class", subject: "中文", start: "10:30", end: "11:05"},
        {type: "recess", NextSubject: "B1", start: "11:05", end: "11:20"},
        {type: "class", subject: "B1", start: "11:20", end: "12:30"},
        {type: "class", subject: "PE", start: "12:30", end: "13:05"},
        {type: "class", subject: "B1", start: "18:23", end: "19:05"},
        {type: "class", subject: "B1", start: "19:05", end: "19:30"},
        {type: "end", start: "19:30"}
    ],
    2: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "B3", start: "8:30", end: "9:40"},
        {type: "recess", NextSubject: "Mathematics", start: "9:40", end: "9:55"},
        {type: "class", subject: "Mathematics", start: "9:55", end: "11:05"},
        {type: "recess", NextSubject: "中文", start: "11:05", end: "11:20"},
        {type: "class", subject: "中文", start: "11:20", end: "12:30"},
        {type: "class", subject: "B2", start: "12:30", end: "13:05"},
        {type: "end", start: "13:05"},
    ],
    3: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "Mathematics", start: "8:30", end: "9:40"},
        {type: "recess", NextSubject: "English", start: "9:40", end: "9:55"},
        {type: "class", subject: "English", start: "9:55", end: "11:05"},
        {type: "recess", NextSubject: "通識", start: "11:05", end: "11:20"},
        {type: "class", subject: "通識", start: "11:20", end: "12:30"},
        {type: "class", subject: "B1", start: "12:30", end: "13:05"},
        {type: "end", start: "19:05"},
    ],
    4: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "B1", start: "8:30", end: "9:40"},
        {type: "recess", NextSubject: "中文", start: "9:40", end: "9:55"},
        {type: "class", subject: "中文", start: "9:55", end: "11:05"},
        {type: "recess", NextSubject: "English", start: "11:05", end: "11:20"},
        {type: "class", subject: "English", start: "11:20", end: "12:30"},
        {type: "class", subject: "B3", start: "12:30", end: "13:05"},
        {type: "end", start: "13:05"}
    ],
    5: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "B2", start: "8:30", end: "9:40"},
        {type: "recess", NextSubject: "通識", start: "9:40", end: "9:55"},
        {type: "class", subject: "通識", start: "9:55", end: "11:05"},
        {type: "recess", NextSubject: "中文", start: "11:05", end: "11:20"},
        {type: "class", subject: "中文", start: "11:20", end: "12:30"},
        {type: "class", subject: "CT", start: "11:55", end: "12:25"},
        {type: "class", subject: "Mathematics", start: "12:30", end: "13:05"},
        {type: "end", start: "13:05"}
    ],
    6: [
        {type: "start", start: "8:15"},
        {type: "class", subject: "B2", start: "8:30", end: "9:40"},
        {type: "recess", NextSubject: "通識", start: "9:40", end: "9:55"},
        {type: "class", subject: "通識", start: "9:55", end: "11:05"},
        {type: "recess", NextSubject: "中文", start: "11:05", end: "11:20"},
        {type: "class", subject: "中文", start: "11:20", end: "12:30"},
        {type: "class", subject: "CT", start: "11:55", end: "12:25"},
        {type: "class", subject: "Mathematics", start: "12:30", end: "13:05"},
        {type: "end", start: "13:05"}
    ]
}

var events = [];

function specialEvent(type) {
    if (type == "search") {
        return events.some((value) => { // Return true / false
            return new Date(value.start) <= new Date() && new Date(value.end) > new Date()
        })
    } else { // Return event object
        return events.find((value, index) => {
            value.index = index; // Set index for identifying
            return new Date(value.start) <= new Date() && new Date(value.end) > new Date()
        })
    }
}

function detect() { // Return lesson object
    let now = new Date();
    let weekday = now.getDay();
    if (weekday > 0 && weekday <= 6) { // Weekday is between Monday and Friday

        // School start time
        let school_start = new Date()
        school_start.setHours(lessons[weekday][0].start.split(":")[0]);
        school_start.setMinutes(lessons[weekday][0].start.split(":")[1]);

        // School end time
        let school_end = new Date()
        school_end.setHours(lessons[weekday][lessons[weekday].length - 1].start.split(":")[0]);
        school_end.setMinutes(lessons[weekday][lessons[weekday].length - 1].start.split(":")[1]);

        if (now < school_start) { // Before school start
            return lessons[weekday][0]
        } else if (now > school_end) { // After school end
            return lessons[weekday][lessons[weekday].length - 1]
        } else if (specialEvent("search")) { // Search special event
            let output = {... specialEvent("get")};
            difference = new Date(output.end) - now;
            output.duration = (difference / 1000); // Change duration
            output.start = output.start.slice(-5); // Remove date
            output.end = output.end.slice(-5); // Remove Date
            return output
        } else { // Search lesson
            return lessons[weekday].find((value, index) => {
                if (value.type == "class" || value.type == "recess") {
                    // Set start and end date
                    let start = new Date();
                    start.setHours(value.start.split(":")[0]);
                    start.setMinutes(value.start.split(":")[1]);
                    start.setSeconds(0);
                    
                    let end = new Date();
                    end.setHours(value.end.split(":")[0]);
                    end.setMinutes(value.end.split(":")[1]);
                    end.setSeconds(0);
                    if (start <= now && end > now) {
                        difference = end - now;
                        value.duration = (difference / 1000); // Change duration
                        value.index = index; // Set index for identifying
                        return true
                    } else {
                        return false
                    }
                }
            })
        }
    } else {
        return false
    }
}