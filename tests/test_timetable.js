var timetable = require('../components/timetable.js');

if (timetable.detect(new Date) != false) {
    if (timetable.detect(new Date).type == "class") {

    } else if (timetable.detect(new Date).type == "recess") {
        
    } else if (timetable.detect(new Date).type == "start") {
        
    } else if (timetable.detect(new Date).type == "end") {
        
    }
} else {
    console.log("No lesson")
}