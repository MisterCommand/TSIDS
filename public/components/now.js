class Now {
    constructor(parent) {
        this.parent = parent;
    }

    set(event, start, end) {
        if (start == "" && end == "") {
            $(this.parent).html(`<div id="event">${event}</div><div id="time"></div>`);
        } else {
            $(this.parent).html(`<div id="event">${event}</div><div id="time">${start} - ${end}</div>`);  
        }
    }
}