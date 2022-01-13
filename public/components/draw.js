class Draw {
    constructor(parent) {
        this.parent = parent;
        this.timer;
        this.chi = ["陳慧慧", "車芍頤", "陳虹池", "陳嘉依", "陳亦非", "徐展晴", "洪梓熹", "郭芷寧", "林靜雅", "李焯殷", "梁韻慧", "盧穎希", "羅銦霆", "麥翠凝", "蕭珮琪", "謝愷晴", "謝宛霖", "尹相如", "王朗玥", "黃易霖", "姚琦燊", "姚怡燊", "朱晨南", "侯天睿", "梁浩維", "李浩源", "李沛諾", "廖俊宇", "柯俊翹", "孫子傑", "王若楷", "王梓丞", "黃康源", "楊嘯宇"];
        this.eng = ["CHAN Wai Wai", "Che Cherie", "Chen Hung Chi Rosie", "CHEN Ka Yee", "CHEN Yik Fei", "Chui Chin Ching Jasmine", "Hung Tsz Hei", "Kwok Tsz Ning", "LAM Jung Ah", "Lee Cheuk Yan", "Leung Wan Wai", "Lo Wing Hei", "Lo Yan Ting", "MAK Chui Ying", "Siu Pui Ki Allie", "Tse Hoi Ching", "Tse Yuen Lam", "Wan Sheung Yu", "Wong Long Yuet", "WONG Yik Lam Kristy", "YAO Ki San", "YAO Yi San", "CHU Sun Nam", "Hou Anthony Tian Rui", "LEUNG Ho Wai", "LI Haoyuan", "Li Pui Lok", "Liu Chun Yu", "Or Chun Kiu", "Suen Tsz Kit", "WANG Ruokai", "WANG Zicheng", "Wong Hong Yuen", "Yeung Siu Yu Vincent"];
        this.kc = [1, 2, 3, 6, 7, 9, 10, 12, 13, 14, 15, 16, 19, 21, 24, 25, 26, 27, 28, 29, 30, 34];
    }

    all() {
        let countdown = 10;
        clearInterval(this.timer);
        let result = Math.floor(Math.random() * 36) + 1; // Return a integer between 1 and 36
        $(this.parent + " > #menu").hide();
        $(this.parent + " > #draw").show();
        $(this.parent + " > #draw > .item:eq(0) > .item:eq(0)").text(result); // Display class number
        $(this.parent + " > #draw > .item:eq(0) > .item:eq(1) > .item:eq(0)").text(this.chi[result - 1]); // Display Chinese name
        $(this.parent + " > #draw > .item:eq(0) > .item:eq(1) > .item:eq(1)").text(this.eng[result - 1]); // Display English name
        $(this.parent + " > #draw > .item:eq(1)").text(`再次抽籤（10）`);
        $(this.parent + " > #draw > .item:eq(1)").click(() => {
            this.all();
        });
        this.timer = setInterval(function () {
            countdown--
            $("#draw > .item:eq(1)").text(`再次抽籤（${countdown}）`);
            if (countdown == 0) {
                clearInterval(this.timer);
                model(true);
            }
        }, 1000);
    }

    chiLesson() {
        let countdown = 10;
        clearInterval(this.timer);
        let result = Math.floor(Math.random() * 23); // Return a integer between 0 and 22
        $(this.parent + " > #menu").hide();
        $(this.parent + " > #draw").show();
        $(this.parent + " > #draw > .item:eq(0) > .item:eq(0)").text(this.kc[result]); // Display class number
        $(this.parent + " > #draw > .item:eq(0) > .item:eq(1) > .item:eq(0)").text(this.chi[this.kc[result] - 1]); // Display Chinese name
        $(this.parent + " > #draw > .item:eq(0) > .item:eq(1) > .item:eq(1)").text(this.eng[this.kc[result] - 1]); // Display English name
        $(this.parent + " > #draw > .item:eq(1)").text(`再次抽籤（10）`);
        $(this.parent + " > #draw > .item:eq(1)").click(() => {
            this.chiLesson();
        });
        this.timer = setInterval(function () {
            countdown--
            $("#draw > .item:eq(1)").text(`再次抽籤（${countdown}）`);
            if (countdown == 0) {
                clearInterval(this.timer);
                model(true);
            }
        }, 1000);
    }
}