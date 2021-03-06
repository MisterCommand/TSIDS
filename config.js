var config = {
    components: {
        event: true,
        homework: true,
        hko: true,
        ccweather: false,
        marquee: true,
		control: true,
		news: true
    },
    intervals: {
        event: 1800000,
        homework: 1800000,
        weather: 600000,
        marquee: 900000
    }
}

module.exports = config;