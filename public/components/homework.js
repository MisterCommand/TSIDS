const subject_colors = {
    "中文": "#FF7043",
    "English": "#42A5F5",
    "數學": "#27ae60",
    "通識": "#9575CD"
}



class Homework {
    constructor(parent) {
        this.parent = parent;
        this.total = 0;
        this.showing = [];
        this.scrolling = 10;
        this.transition = 1500;
        this.duration = 10000;
        this.started = false;
        this.animation;
    }

    create(subject, end, required, title) {
        $(this.parent).html($(this.parent).html() + `<div class="homework homework_${this.total}"><div><span style="background-color: ${subject_colors[subject]}">${subject}</span><span>${end} ${required}</span><div><span>${title}</span></div></div></div>`)
        this.total += 1;
    }
    
    import(array) { // array = [{subject: "", end: "", required: "", title: ""} ... ]
        // Clear Existing Items
        this.total = 0;
        $(this.parent).html("");

        for (let item of array) {
            item.subject = item.subject == "中國語文" ? "中文" : item.subject;
            item.subject = item.subject == "數學(必修部分)" ? "數學" : item.subject;
            item.subject = item.subject == "英國語文" ? "English" : item.subject;
            item.end_YYYYMD = `${new Date(item.end).getFullYear()}年${new Date(item.end).getMonth()+1}月${new Date(item.end).getDate()}日`;
            item.end_MD = `${new Date(item.end).getMonth()+1}月${new Date(item.end).getDate()}日`; // For homeworkcard.js
            item.required = item.required == "是" ? "需要提交" : "";
            this.create(item.subject, item.end_YYYYMD, item.required, item.title)
        }
        this.animateIn();
    }

    animateIn() {
        this.showing = [];
        let offset = 0;
        for (let i=0;i<this.total;i++) {
            let target = this.parent + ">" + ".homework_" + i;
            $(target).show(); // Enable display for all items (initial opacity = 0)
            let item = document.getElementById(this.parent.replace("#", "")).getElementsByClassName("homework_" + i)[0].children[0].children[2];
            if (item.offsetWidth < item.scrollWidth) { // If overflow -> add "scrolling" class
                item.classList.add("scrolling"); // Identify scrolling divs
                // Animation
                anime({
                    targets: target + ">div>.scrolling>span",
                    translateX: [$(target + ">div>.scrolling>span").width(), $(target + ">div>.scrolling>span").width() * -1],
                    duration: $(target + ">div>.scrolling>span").width() * this.scrolling,
                    easing: "linear",
                    loop: true
                });
            }
            if (i < 5) { // items shown in list (0-4)
                anime({
                    targets: target,
                    opacity: [0, 1],
                    duration: 500,
                    delay: offset,
                    easing: "linear"
                });
                offset += 100;
                this.showing.push(i)
            } else { // Other items -> positioned at item 4
                $(target).css({opacity: 0, position: "absolute"}).offset({top: $(this.parent + ">" + ".homework_" + 4).offset().top,left: $(this.parent + ">" + ".homework_" + 4).offset().left});
            }
        }
    }

    animateSlide() {
        if (this.total > 5) {
            for (let i=0;i<this.total && i<5;i++) {
                if (i == 0) { // First item
                    cardMoveUpFadeOut(this.parent + ">" + ".homework_" + this.showing[i])
                } else { // Other items
                    cardMoveUp(this.parent + ">" + ".homework_" + this.showing[i])
                }
            }
            // Update this.showing (next list of showing items)
            this.showing = this.showing.map((value) => {
                if (this.total - value >= 2) {
                    return value + 1
                } else {
                    return 0
                }
            })
            cardFadeIn(this.parent + ">" + ".homework_" + this.showing[4])
        }
    }

    start() {
        if (!this.started) { // If already started
            this.started = true;
            this.animation = setInterval(() => {
                this.animateSlide()
            }, this.duration);
        }
    }

    stop() {
        if (this.started) {
            this.started = false;
            clearInterval(this.animation)
        }
    }

}

function cardMoveUpFadeOut(target) {
    anime({
        targets: target,
        translateY: [
            {value: getTransformY(target) + $(target).outerHeight(true) * -1.15, duration: this.transition},
            {value: getTransformY(target) + $(target).outerHeight(true) * 4, duration: this.transition, delay: 1600},
        ],
        opacity: [
            {value: 0, duration: this.transition},
        ],
        easing: "easeInQuad"
    })
}

function cardMoveUp(target) {
    anime({
        targets: target,
        translateY: [
            {value: getTransformY(target) + $(target).outerHeight(true) * -1, duration: this.transition},
        ],
        easing: "easeInOutQuad"
    })
}

function cardFadeIn(target) {
    anime({
        targets: target,
        translateY: [
            {value: [getTransformY(target) + $(target).outerHeight(true) * 1, getTransformY(target)], duration: this.transition},
        ],
        opacity: [
            {value: [0, 1], duration: this.transition},
        ],
        easing: "easeInOutQuad"
    })
}

function getTransformY(target) {
    if (isNaN(parseFloat($(target).css('transform').split(",")[5]))) {
        return 0
    } else {
        return parseFloat($(target).css('transform').split(",")[5])
    }
}