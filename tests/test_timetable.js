var timetable = require('../components/timetable.js');

if (timetable.detect(new Date) != false) {
    if (timetable.detect(new Date).type == "class") {
        console.log("Lesson: " + timetable.detect(new Date).subject)
    } else if (timetable.detect(new Date).type == "recess") {
        console.log("Recess, next class: " + timetable.detect(new Date).NextSubject)
    } else if (timetable.detect(new Date).type == "start") {
        console.log("School started")
    } else if (timetable.detect(new Date).type == "end") {
        console.log("School ended")
    }
} else {
    console.log("No lesson")
}