let axios = require("axios");

async function getMovies(request, results, next) {
  try {
    // get keyword from front end (lat and lon for the lab)
    let movie = request.query.searchQuery;

    //make axios call to unsplash (weather and movie apis)
    let movie_url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MOVIES_API_KEY}&language=en-US&query=${movie}&page=1&include_adult=false`;
    let movieResults = await axios.get(movie_url);
    let movieDataSend = movieResults.data.results.map(
      (element) => new Movie(element)
    );

    //groom data (using a class) to send back to front end
    results.status(200).send(movieDataSend);
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
