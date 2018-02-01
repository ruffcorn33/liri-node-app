// dependencies
require("dotenv").config();
//var keys = require('keys.js');
var fs = require('fs');
var request = require('request');

// LIRI flow control
var operation = process.argv[2]
switch(operation){
  case 'my-tweets':
    doTweets();
    break;
  case 'spotify-this-song':
    doSpotify();
    break;
  case 'movie-this':
    doMovie();
    break;
  case 'do-what-it-says':
    doRandom();
    break;
  case 'help':
    doHelp();
    break;
  default:
    console.log("Try 'node liri help'");   
}

function doTweets(){
  console.log('do tweets stuff here');
}

function doSpotify(){
  console.log('do spotify stuff here');
}

function doMovie(){
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

    // loop through the Ratings array of objects  
    var imdb_rating;
    var rotTomatoes;
    for (i=0; i<movieObj.Ratings.length; i++){
      if (movieObj.Ratings[i].Source === 'Internet Movie Database') {
        imdb_rating = movieObj.Ratings[i].Value;
      };
      if (movieObj.Ratings[i].Source === 'Rotten Tomatoes') {
        rotTomatoes = movieObj.Ratings[i].Value;
      };
    };

    // output movie data to console
    console.log('Title: '+movieObj.Title);
    console.log('Year: '+movieObj.Year);
    if (imdb_rating){
      console.log('IMDB Rating: '+imdb_rating);
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
  
function doHelp(){
  console.log('Usage: node liri [operation] [arguments]');
  console.log('Operations:');
  console.log('  my-tweets                  [no arguments]');
  console.log('  spotify-this-song          [song title]');
  console.log('  movie-this                 [movie title]');
  console.log('  do-what-it-says            [no arguments]');
}
