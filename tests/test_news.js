var news = require('../components/news.js');

news.get()
    .then((data) => {
        console.log(data)
    })
    .catch((error) => {
        console.log(error)
    })