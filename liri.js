
// dependencies
require("dotenv").config();
var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');

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
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  inquirer.prompt([
    {
      type: 'list',
      name: 'feed',
      message: 'Whose tweets do you want to see?',
      choices: [
        'badbanana',
        'SICKOFWOLVES',
        'pourmecoffee',
        'TheTweetOfGod'
      ]
    }
  ])
  .then(answers => {
    var params = {screen_name: answers.feed};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        for(i=0; i< tweets.length; i++){
          console.log(tweets[i].created_at);
          console.log(tweets[i].text);
          console.log("-------------------------------------------------------------------");
        }
      }
      else {
        doError(4);
      }
    });
  });

}

function doSpotify(){

  var spotify_input = [
    {
      type: 'input',
      name: 'song_title',
      message: "What song would you like to search for?",
      default: function() {
        return 'The Sign';
      }
    }
  ];
  
  inquirer.prompt(spotify_input).then(query => {
    var spotify = new Spotify({
      id: process.env.SPOTIFY_ID,
      secret: process.env.SPOTIFY_SECRET
    }); 
    spotify
    .search({ type: 'track', query: query.song_title })
    .then(function(tracks) {
      var song = tracks.tracks.items[0].name;
      var artist = tracks.tracks.items[0].artists[0].name;
      var album = tracks.tracks.items[0].album.name
      console.log( song + " by " + artist + " from the album " + album);
      if (tracks.tracks.items[0].preview_url != null){
        console.log(tracks.tracks.items[0].preview_url);
      }
      else {
        console.log("no preview")
      }
    })
    .catch(function(err) {
      console.log(err);
    });
  });
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
    // add check for !error && response.statusCode===200 

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
  console.log('  spotify-this-song          [no arguments]');
  console.log('  movie-this                 [movie title]');
  console.log('  do-what-it-says            [no arguments]');
}

function doError(err){
  switch(err){
    // case 1:
    //   console.log("Spotify couldn't find that song");
    //   break;
    case 2:
      console.log('You must include a movie title');
      break;
    case 3:
      console.log("Try 'node liri help'");
      break;
    case 4:
      console.log("Twitter did not return any tweets") ;
      break; 
    default:
      console.log("I'm not really sure what happened there");
  };
}