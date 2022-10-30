let axios = require("axios");

let cache = {};

//need a key for data tp store
//value
//if the things exist AND is in a valid timframe, send that data
//if the things DO NOT exist, cache them

async function getWeather(request, response, next) {
  try {
    //get data from front end query
    let lat = Math.floor(request.query.lat);
    let lon = Math.floor(request.query.lon);
    //make request to weather service API
    //make a key for the data when it's requested
    console.log(cache);
    let new_key = `${lat}_${lon}`;

    if (cache[new_key] && Date.now - cache[new_key].timestamp < 43200000) {
      console.log('cache hit, forecast present');
      response.status(200).send(cache[new_key].data);
    }
    else {
      console.log('cache miss, no forecast present');

      let weather_url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.REACT_APP_WEATHERBIT_KEY}&units=I&days=10&lat=${lat}&lon=${lon}`;

      let weather_results = await axios.get(weather_url);


      let dataToSend = weather_results.data.data.map(
        (element) => new Forecast(element)
      );

      cache[new_key] = {
        data: dataToSend,
        timestamp: Date.now()
      };
      response.status(200).send(dataToSend);
    }
  } catch (error) {
    next(error);
  }
}

class Forecast {
  constructor(object) {
    this.description = object.weather.description;
    this.date = object.valid_date;
  }
}

module.exports = getWeather;
