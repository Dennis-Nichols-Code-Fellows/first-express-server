'use strict';

console.log('Hello World!');

// -------- REQUIRES ----------
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { request } = require('express');
const axios = require('axios');

//this is our server
const app = express();

//this is middleware to share resources accross the web
app.use(cors());

// define port, if server on 3002 then I know something up on env file
const PORT = process.env.PORT || 3002;
// -------- ENDPOINTS ----------

// Base endpoint
app.get('/', (req, res) =>{
  console.log('This is showing up!');
  res.status(200).send('Welcome to the server. Beep Boop Beep.');
});

// weather endpoint
app.get('/weather', async (request, response, next) =>{
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
    let dataToSend = weather_results.data.data.map(element => new Forecast(element));

    response.status(200).send(dataToSend);
  } catch(error) {
    next(error);
  }
});


app.get('/movies', async (request, results, next) => {

  try {
    // get keyword from front end (lat and lon for the lab)
    let movie = request.query.searchQuery;

    //make axios call to unsplash (weather and movie apis)
    let movie_url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MOVIES_API_KEY}&language=en-US&query=${movie}&page=1&include_adult=false`;
    let movieResults = await axios.get(movie_url);
    let movieDataSend = movieResults.data.results.map((element) => new Movie(element));

    //groom data (using a class) to send back to front end
    results.status(200).send(movieDataSend);

  } catch(error) {
    next(error);
  }

});

class Movie {
  constructor(object) {
    this.title = object.title;
    this.release = object.release_date;
    this.poster_path = object.poster_path;
    this.poster_url= `https://image.tmdb.org/t/p/original/${this.poster_path}`;
  }
}


class Forecast {
  constructor(object){
    this.description = object.weather.description;
    this.date = object.valid_date;
  }
}

app.get('*', (req, res) => {
  res.status(404).send('This route does not exist');
});


// -------- ERROR HANDLING ----------

app.use((error, request, response)=> {
  response.status(500).send(error.message);
});



// -------- SERVER START ----------

app.listen(PORT, () => console.log(`We are running on port ${PORT}.`));
