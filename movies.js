let axios = require("axios");
const cache = require("./cache.js");

async function getMovies(request, results, next) {
  try {
    // get keyword from front end (lat and lon for the lab)
    let movie = request.query.searchQuery;
    const key = "movie-" + movie;
    let movie_url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MOVIES_API_KEY}&language=en-US&query=${movie}&page=1&include_adult=false`;

    //set up cache logic
    if (cache[key] && Date.now() - cache[key].timestamp < 50000) {
      console.log("Cache hit");
    } else {
      console.log("Cache miss");
      let movieResults = await axios.get(movie_url);
      let movieDataSend = movieResults.data.results.map(
        (element) => new Movie(element)
      );
      cache[key] = {};
      cache[key].timestamp = Date.now();
      cache[key].data = movieDataSend;
      //groom data (using a class) to send back to front end
    }
    // let today = Date.now().toUTCString();
    results.status(200).send(cache[key]);
  } catch (error) {
    next(error);
  }
}

class Movie {
  constructor(object) {
    this.title = object.title;
    this.release = object.release_date;
    this.poster_path = object.poster_path;
    this.poster_url = `https://image.tmdb.org/t/p/original/${this.poster_path}`;
  }
}

module.exports = getMovies;
