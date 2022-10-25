'use strict';

console.log('Hello World!');

// -------- REQUIRES ----------
const express = require('express');
require('dotenv').config();
const cors = require('cors');
let data = require('./data/weather.json');

//this is our server
const app = express();

//this is middleware to share resources accross the web
app.use(cors());

// define port, if server on 3002 then I know something up on env file
const PORT = process.env.PORT || 3002;

// -------- ENDPOINTS ----------
app.get('/', (req, res) =>{
  console.log('This is showing up!');
  res.status(200).send('Welcome to the server. Beep Boop Beep.');
});

app.get('/weather', (request, response, next) =>{
  try {
    let city = request.query.searchQuery;
    let lat = Math.floor(request.query.lat);
    let lon = Math.floor(request.query.lon);
    let dataToGroom = data.find(weatherObj => (weatherObj.city_name === city && Math.floor(weatherObj.lat) === lat && Math.floor(weatherObj.lon) === lon));
    let dataToSend = dataToGroom.data.map(element => new Forecast(element));

    response.status(200).send(dataToSend);
  } catch(error) {
    next(error);
  }
});

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

app.use((error, request, response, next)=> {
  response.status(500).send(error.message);
});



// -------- SERVER START ----------

app.listen(PORT, () => console.log(`We are running on port ${PORT}.`));
