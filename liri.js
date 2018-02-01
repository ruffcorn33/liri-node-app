// dependencies
require("dotenv").config();
//var keys = require('keys.js');
var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');


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
    doError(3);  
}

function doTweets(){
  console.log('Twitter functionality is under construction');
  var client = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
  });
}

function doSpotify(){
  // throw error for no song title
  if (process.argv.length < 4){doError(1);};
  console.log('Spotify functionality is under construction');
}

function doMovie(){
  // throw error for no movie title
  if (process.argv.length < 4){doError(2)};
  // assemble movie name
  var movieName = "";
  for (i=3; i<process.argv.length; i++){
    movieName = movieName + ' ' + process.argv[i];
  };
  // trim leading whitespace and replace internal spaces with '+'
  movieName = movieName.trim().replace(" ", "+");
  // assemble request URL
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  // create a request to the queryUrl
  request.get(queryUrl, function(err, res, body){
    var movieObj = JSON.parse(body); // console.log(movieObj);
    var imdb_rating;
    var rotTomatoes;
    // loop through the Ratings array of objects  
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

function doRandom(){
  console.log('random functionality is under construction');
}
  
function doHelp(){
  console.log('Usage: node liri [operation] [arguments]');
  console.log('Operations:');
  console.log('  my-tweets                  [no arguments]');
  console.log('  spotify-this-song          [song title]');
  console.log('  movie-this                 [movie title]');
  console.log('  do-what-it-says            [no arguments]');
}

function doError(err){
  switch(err){
    case 1:
      console.log('You must include a song title');
      break;
    case 2:
      console.log('You must include a movie title');
      break;
    case 3:
      console.log("Try 'node liri help'");
    default:
      console.log('Unknown error');
  };
}