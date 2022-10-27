let axios = require("axios");

async function getWeather(request, response, next) {
  try {
    //get data from front end query
    let lat = Math.floor(request.query.lat);
    let lon = Math.floor(request.query.lon);
    //make request to weather service API

    let weather_url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.REACT_APP_WEATHERBIT_KEY}&units=I&days=10&lat=${lat}&lon=${lon}`;
    let weather_results = await axios.get(weather_url);
    console.log(weather_results);

    //groom data and send back
    // let dataToGroom = weather_results.find(weatherObj => (Math.floor(weatherObj.lat) === lat && Math.floor(weatherObj.lon) === lon));
    let dataToSend = weather_results.data.data.map(
      (element) => new Forecast(element)
    );

    response.status(200).send(dataToSend);
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
