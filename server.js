'use strict';

console.log('Hello World!');

// -------- REQUIRES ----------
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { request } = require('express');
const getWeather = require('./weather');
const getMovies = require('./movies');
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
app.get('/weather', getWeather);


app.get('/movies',getMovies);

app.get('*', (req, res) => {
  res.status(404).send('This route does not exist');
});


// -------- ERROR HANDLING ----------

app.use((error, request, response, next)=> {
  response.status(500).send(error.message);
});



// -------- SERVER START ----------

app.listen(PORT, () => console.log(`We are running on port ${PORT}.`));
