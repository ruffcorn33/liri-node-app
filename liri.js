
// dependencies
require("dotenv").config();
var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');


// LIRI flow control
var operation = process.argv[2];
var params = "";
for(i=3; i<process.argv.length; i++){
  params = params + ' ' + process.argv[i]
}
switch(operation){
  case 'my-tweets':
    doTweets();
    break;
  case 'spotify-this-song':
    doSpotify(params);
    break;
  case 'movie-this':        
    doMovie(params);
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

function doSpotify(title){
  let song_title = ""; 
  if(title != ""){
    song_title = title
  }
  else {
    // default to this crap song
    song_title = 'the sign';
  }
  // query spotify
  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  }); 
  spotify
  .search({ type: 'track', query: song_title})
  .then(function(tracks) {
    var songBreak = '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~';
    var song = tracks.tracks.items[0].name;
    var artist = tracks.tracks.items[0].artists[0].name;
    var album = tracks.tracks.items[0].album.name;
    var msg =  song + " by " + artist + " from the album " + album;
    console.log(songBreak);
    console.log(msg);
    doLog("'spotify-this-song' results")
    doLog(msg);
    if (tracks.tracks.items[0].preview_url != null){
      console.log(tracks.tracks.items[0].preview_url);
    }
    else {
      console.log("no preview")
    }
    console.log(songBreak);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function doMovie(title){
  // throw error for no movie title
  if (!title){
    doError(2);
  }
  else {
    // trim leading whitespace and replace internal spaces with '+'
    title = title.trim().replace(" ", "+");
    // assemble request URL
    var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
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
      doLog("'movie-this' results")
      console.log('Title: '+movieObj.Title);
      doLog('Title: '+movieObj.Title);
      console.log('Year: '+movieObj.Year);
      doLog('Year: '+movieObj.Year);
      if (imdb_rating){
        console.log('IMDB Rating: '+imdb_rating);
        doLog('IMDB Rating: '+imdb_rating);
      };
      if (rotTomatoes){
        console.log('Rotten Tomatoes Score: '+rotTomatoes);
        doLog('Rotten Tomatoes Score: '+rotTomatoes);
      };
      console.log('Country: '+movieObj.Country);
      doLog('Country: '+movieObj.Country);
      console.log('Language: '+movieObj.Language);
      doLog('Language: '+movieObj.Language);
      if (movieObj.Plot != 'N/A'){
        console.log('Plot: '+movieObj.Plot);
        doLog('Plot: '+movieObj.Plot);
      };
      console.log('Actors: '+movieObj.Actors); 
      doLog('Actors: '+movieObj.Actors);

    });
  }
}

function doRandom(){
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {return console.log(err)}
    else {
      let output = data.split(","); 
      if (output[0] && output[1]){
        switch(output[0]){
          case 'my-tweets':
          doTweets();
          break;
        case 'spotify-this-song':
          doSpotify(output[1]);
          break;
        case 'movie-this':        
          doMovie(output[1]);
          break;
        default:
          doError(3);
        }
      } 
      else {
        console.log(5)
      }
    }
  });
}

function doLog(str){
  str = str +'\n';
  let lineBrk = "--------------------------------------------------------------------------------------\n";
  let timeStamp = Date() + '\n';
  fs.appendFile('log.txt', timeStamp, (err) => {
    if (err) throw err;
  });
  fs.appendFile('log.txt', str, (err) => {
    if (err) throw err;
  });
  fs.appendFile('log.txt', lineBrk, (err) => {
    if (err) throw err;
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

function doError(err){
  switch(err){
    // case 1:
    //   console.log("Spotify couldn't find that song");
    //   break;
    case 2:
      console.log('You must include a movie title');      
      doLog('Error thrown: no movie title entered');
      break;
    case 3:
      console.log("Try 'node liri help'");
      doLog('error thrown: Liri run without parameters - help message displayed')
      break;
    case 4:
      console.log("Twitter did not return any tweets");
      doLog('Error thrown: Twitter did not return any data')
      break; 
    case 5:
      console.log("The data in random.txt is not formatted correctly");
      doLog("Error thrown: The data in random.txt is not formatted correctly")
      break;
    default:
      console.log("I'm not really sure what happened there");
      doLog('Error thrown: Unknown error')
  };
}