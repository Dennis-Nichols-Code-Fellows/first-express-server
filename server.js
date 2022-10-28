"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const getWeather = require('./weather.js');
const getMovies = require('./movies.js');


const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;
// ----End points ------

app.get("/", (req, res) => {
  console.log("This is showing up!");
  res.status(200).send("Welcome to the server. Beep Boop Beep.");
});

app.get("/movies", getMovies);

app.get("/weather", weatherHandler);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  getWeather(lat, lon)
    .then((summaries) => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send("Sorry. Something went wrong!");
    });
}

app.listen(PORT, () =>
  console.log(`Server up on ${PORT}`)
);
