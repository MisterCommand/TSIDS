var scraper = require('../components/scraper.js');

scraper.news()
    .then((data) => {
        console.log(data)
    })
    .catch((error) => {
        console.log(error)
    })