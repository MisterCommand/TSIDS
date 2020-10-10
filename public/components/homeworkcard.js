class HomeworkCard {
    constructor(parent) {
        this.parent = parent;
        this.homework = [];
        this.current = 0;
        this.started = false;
        this.duration = 5000;
        this.transition = 500;
        this.animation;
        this.today = 0;
        this.future = 0;
    }

    set(type, value) {
        switch (type) {
            case "homework":
                this.homework = value // array = [{subject: "", end_MD: "", title: ""} ... ]
                break
            case "today":
                this.today = value;
                if (!this.started) {
                    this.overview();
                }
                break
            case "future":
                this.future = value;
                if (!this.started) {
                    this.overview();
                }
                break
        }
    }

    switch() {
        if (this.homework.length > 0) { // Has homework in list
            if ($(this.parent + "> .homework-card").length) { // .homework-card is present
                // Transit to the first card
                var animate_switch = anime.timeline({
                    targets: this.parent + "> .homework-card",
                    easing: "linear",
                    duration: this.transition
                })
                animate_switch
                    .add({
                        opacity: [1, 0],
                        complete: () => {
                            this.current = ((this.homework.length - this.current) > 1) ? this.current += 1 : 0
                            $(this.parent + "> .homework-card").html(`<span>${this.homework[this.current].subject}</span><span>${this.homework[this.current].end_MD}</span><span>${this.homework[this.current].title}</span><span>${this.current + 1}/${this.homework.length}</span>`);
                        }
                    })
                    .add({
                        opacity: [0, 1]
                    })
            } else {
                // Transit to the next card
                anime({
                    targets: this.parent + "> .homework-overview",
                    opacity: [1, 0], // Fade out
                    easing: "linear",
                    duration: this.transition,
                    complete: () => {
                        this.current = 0;
                        $(this.parent).html(`<div class="homework-card"><span>${this.homework[this.current].subject}</span><span>${this.homework[this.current].end_MD}</span><span>${this.homework[this.current].title}</span><span>${this.current + 1}/${this.homework.length}</span></div>`)
                        anime({
                            targets: this.parent + "> .homework-card",
                            opacity: [0, 1], // Fade in
                            easing: "linear",
                            duration: this.transition
                        })
                    }
                })
            }
        }
    }

    start() {
        this.switch();
        if (!this.started) { // If already started
            this.started = true;
            this.animation = setInterval(() => {
                this.switch()
            }, this.duration);
        }
    }

    stop() {
        if (this.started) {
            this.started = false;
            clearInterval(this.animation)
        }
    }

    overview() {
        if (this.started) {
            this.stop()
        }
        if ($(this.parent + "> .homework-overview").length) { // .homework-overview is present
            // Refresh
            $(this.parent).html(`<div class="homework-overview"><span>今日提交</span><span><svg style="width:30px;height:30px" viewBox="0 0 24 24"><path fill="currentColor" d="M7,10H12V15H7M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" /></svg></span><span>${this.today}</span><span>即将提交</span><span><svg style="width:30px;height:30px" viewBox="0 0 24 24"><path fill="currentColor" d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z" /></svg></span><span>${this.future}</span> </div>`)
        } else { // Update overview
            anime({
                targets: this.parent + "> .homework-card",
                opacity: [1, 0], // Fade out
                easing: "linear",
                duration: this.transition,
                complete: () => {
                    $(this.parent).html(`<div class="homework-overview"><span>今日提交</span><span><svg style="width:30px;height:30px" viewBox="0 0 24 24"><path fill="currentColor" d="M7,10H12V15H7M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" /></svg></span><span>${this.today}</span><span>即将提交</span><span><svg style="width:30px;height:30px" viewBox="0 0 24 24"><path fill="currentColor" d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z" /></svg></span><span>${this.future}</span> </div>`)
                    anime({
                        targets: this.parent + "> .homework-overview > span",
                        opacity: [0, 1],
                        easing: "linear",
                        delay: anime.stagger(100) // Fade in one by one
                    })
                }
            })
        }
    }
}