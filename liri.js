// dependencies
require("dotenv").config();
//var keys = require('keys.js');
var fs = require('fs');
var request = require('request');

var operation = process.argv[2]


if (operation === 'movie-this') {
  // assemble movie name
  var movieName = "";
  for (i=3; i<process.argv.length; i++){
    movieName = movieName + ' ' + process.argv[i];
  }
  // trim leading whitespace
  movieName = movieName.trim();
  // replace internal spaces with '+'
  movieName = movieName.replace(" ", "+");
  
  
  // Assemble request URL
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  // create a request to the queryUrl
  var movieObj;
  request.get(queryUrl, function(err, res, body){
    movieObj = JSON.parse(body);
    // console.log(movieObj);
    var imdbRating;
    var rotTomatoes;

    for (i=0; i<movieObj.Ratings.length; i++){
      if (movieObj.Ratings[i].Source === 'Internet Movie Database') {
        imdbRating = movieObj.Ratings[i].value;
      }
      else if (movieObj.Ratings[i].Source === 'Rotten Tomatoes') {
        rotTomatoes = movieObj.Ratings[i].Value;
      };
    };


    console.log('Title: '+movieObj.Title);
    console.log('Year: '+movieObj.Year);
    if (imdbRating){
      console.log('IMDB Rating: '+imdbRating);
    };
    if (rotTomatoes){
      console.log('Rotten Tomatoes Score: '+rotTomatoes);
    };
    console.log('Country: '+movieObj.Country);
    console.log('Language: '+movieObj.Language);
    if (movieObj.Plot != 'N/A'){
      console.log('Plot: '+movieObj.Plot);
    };
    console.log('Actors: '+movieObj.Actors);
    
  });
}