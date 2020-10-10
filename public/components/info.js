class Info {
    constructor(parent) {
        this.parent = parent;
        this.transition = 500;
        this.scrolling = 50;
        this.separation = 1; // Insert ? empty line between items
    }

    set(info) { // info = [item, ...]
        info = info.map((value) => {
            if (Array.isArray(value)) { // Has sub array
                return value.join("<br>")
            } else {
                return value
            }
        })
        info = info.join("<br>".repeat(this.separation+1)); // Array -> string
        anime({
            targets: this.parent + "> .info",
            opacity: [1, 0], // Fade out
            easing: "linear",
            duration: this.transition,
            complete: () => {
                $(this.parent).html(`<div class="info" id="info"><span>${info}</span></div>`); // Change content
                anime({
                    targets: this.parent + "> .info",
                    opacity: [0, 1], // Fade in
                    easing: "linear",
                    duration: this.transition,
                    complete: () => {
                        let item = document.getElementById("info");
                        if (item.offsetHeight < item.scrollHeight) { // If overflow -> animation
                            anime({
                                targets: this.parent +  " > #info > span",
                                translateY: [$("#info").height(), $("#info > span").height() * -1],
                                duration: $("#info > span").height() * this.scrolling,
                                easing: "linear",
                                loop: true
                            });
                        }
                    }
                })
            }
        })
    }
}