var hko = require('./hko.js');

hko.temp()
    .then((data) => {
        console.log(data)
    })
    .catch((error) => {
        console.log(error)
    })

hko.specialWeatherWarning()
    .then((data) => {
        console.log(data)
    })
    .catch((error) => {
        console.log(error)
    })

hko.weatherWarning()
    .then((data) => {
        console.log(data)
    })
    .catch((error) => {
        console.log(error)
    })