/*LIRI is a Language Interpretation and Recognition Interface. 
It will take requests and an argument, and returns data about the argument. 

LIRI is able to: 
-> Retrieve Tweets from Twitter
-> Song info using Spotify
-> LIRI is also to call any text file that includes action or argument.
*/

// REQUIRED NPM MODULES && FILES

require('dotenv').config();
var keys = require('./keys.js');
var twitter = require('twitter');
var spotify = require('spotify');
var nodeSpotifyAPI = require ('node-spotify-api');
var request = require('request');
var fs = require ('fs'); 

/*
^^^^^^^^^^^^^^^^^^^^^^^^^^^^  NPM MODULES   ^^^^^^^^^^^^^^^^^

^^^^^^^^^^^^^^^^^^^^^^^^^^^^ DECLARE MAIN VARIABLES ^^^^^^^^^^^^^
*/
//read cmd line args 
argArray = process.argv;
argArray.shift();
argArray.shift();
console.log ("Arg Array: "+argArray);
//action will always be the second cmd line arg 
var LIRIaction = process.argv[0];
console.log('action: '+LIRIaction);

//STORE ARGUMENT IN ARRAY
 var argument = '' ;
 for (var i = 1; i < argArray.length; i++){
    argument += argArray[i]+(',');
 }
 console.log("Argument: "+argument);

//FUNCTION THAT DETERMINES WHAT ACTION IS TAKEN 
if (LIRIaction === 'my-tweets'){
    console.log('my-tweets');
    getTweets();
    console.log('Getting tweets.. ')
} else if (LIRIaction === 'spotify-this-song') {
    spotifyThis(argument);
    console.log('checking for song on Spotify...');
} else if (LIRIaction === 'movie-this'){
    getMovie(argument);
    console.log('searching database for movie.... ');
} else if (LIRIaction === 'do-what-it-sats'){
    doWhatItSays();
    console.log('reading command.. ');
};

//MY TWEETS
function getTweets(){
    fs.appendFile('log.txt', 'User Command: node liri.js my-tweets \n\n', function (err){
        if (err){console.log("*****************************FILESYSTEM ERROR*****************************: "+err)};
    });

    //INITIALIZE CLIENT
var client = new twitter(keys.twitter);

var params = {
    id: '@amertoukan2',
    count:20
};

//PRINT 20 TWEETS
client.get('statuses/user_timeline',params, function(err, tweets, response)
{
    if (err) {
        fs.appendFile('log.txt',"*********************************  ERROR RETRIEVING TWEETS ************************************"+ (JSON.stringify(err)),function(err){ if (err){console.log(err)}});      
    } else{
        var outputStr = '-----------------\n'+
                                 'User Tweets: ' + 
                                    '-----------------\n\n';
        
for (var i = 0; i < tweets.length; i++){
            outputStr += 'Created on: '+ tweets[i].created_at + '\n' +
            'Tweet: ' +tweets[i].text+ '-----------------\n';
}

fs.appendFile('./log.txt', 'LIRI RESPONSE:\n\n\n' + outputStr + '\n', function(err){if(err){console.log(err); console.log(outputStr)}});  
} 
});
}
 

//SPOTIFY FUNCTION
function spotifyThis(songTitle){
//Spotify API 


    fs.appendFile('./log.txt', 'User Command: node liri.js spotify-this-song'+ songTitle + '/n', (err)=>{
        if (err)
        {console.log("Logging error: "+err)};
    });

    //USE DEFAULT SONG
    var search;
    if (songTitle === ''){
        search = 'The Sign Of Base';
    }else {
        search = songTitle; 
    }
    spotify.search({type: 'track', query: search}, function(err,data){ 
        if(err){
        fs.appendFile('log.txt',"*********************************  ERROR RETRIEVING SPOTIFY TRACK ************************************"+ (JSON.stringify(err)), function(err){ 
            if (err) throw err;
    });
      return;  
    } else {
        var songInfo = data;
        if(!songInfo){
                var errStr = 'ERROR: NO SONG RETRIEVED, please check the spelling of the song and try again!';

                fs.appendFile('./log.txt',errStr, (err) => {
                    if(err) console.log(errStr+err)
                });
                return;
        } else {
            var outputStr = '------------------------\n' + 
            'Song Information:\n' + 
            '------------------------\n\n' + 
            'Song Name: ' + songInfo.name + '\n'+ 
            'Artist: ' + songInfo+ '\n' + 
            'Album: ' + songInfo + '\n' + 
            'Preview Here: ' + songInfo.preview_url + '\n'
            +'------------------------\n\n\n';
            fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
                if (err) throw err;
                console.log(outputStr);
            });
        }
    }
});
}

//OMDB FUNCTION TO RETRIEVE MOVIES 
function getMovie(movieTitle){
    console.log("Movie Title: "+movieTitle);
    //APPEND TO LOG
    fs.appendFile('./log.txt','User Command: node.js movie-this'+'/n/n' + movieTitle + '/n/n' , (err) => {
        if (err){
        console.log("Error Appending to file" + err);
    }
    });
    var search;
    

      //DEFAULT MOVIE 
    if (movieTitle === ''){
        search = "Mr+Nobody";
    } else {
        search = movieTitle;
    };
    
    //REPLACE SPACE WITH '+'
    var query = search.split(',').join('+');
    console.log('Searching for... ' + query)

    //QUERY SEARCH
    var queryStr = 'http://www.omdbapi.com/?t=' + query +'&plot=full&tomatoes=true&apikey=trilogy';
   console.log('Query URL: '+queryStr);

    //SEND QUERY REQUEST TO OMBD
    request (queryStr, function(err, response, body){
        if ( err || (response.statusCode !== 200) ) {
            var errStr1 = '*********************************  ERROR RETRIEVING OMDB ENTRY' + err + "/n/n/n/n";

            fs.appendFile('./log.txt' , errStr1 , (err) => {
                if(err) throw err
                console.log(errStr1);
             }); return; 
             } else {
                        var data = JSON.parse(body);
                        
                        if (!data.Title && !data.Released && !data.imdbRating){
                            var noMovie = '*********************************  NO MOVIE FOUND, check the spelling & try again.  '
                            fs.appendFile('./log.txt', noMovie , (err) => {if (err){
                                console.log(err);
                            }
                        })
                        } else{
                            var outputStr = '------------------------\n' + 
                            'Movie Information:\n' + 
                            '------------------------\n\n' +
                            'Movie Title: ' + data.Title + '\n' + 
                            'Year Released: ' + data.Released + '\n' +
                            'IMBD Rating: ' + data.imdbRating + '\n' +
                            'Country Produced: ' + data.Country + '\n' +
                            'Language: ' + data.Language + '\n' +
                            'Plot: ' + data.Plot + '\n' +
                            'Actors: ' + data.Actors + '\n' + 
                            'Rotten Tomatoes Rating: ' + data.tomatoRating + '\n' +
                            'Rotten Tomatoes URL: ' + data.tomatoURL + '\n';

            // Append the output to the log file
            fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
                if (err) throw err;
                console.log(outputStr);
            });
        }
                        }
                })
            }
function justDoIt() {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: node liri.js do-what-it-says\n\n', (err) => {
		if (err) throw err;
	});

	// Read in the file containing the command
	fs.readFile('./random.txt', 'utf8', function (err, data) {
		if (err) {
			console.log('*********************************  ERROR READING DATA  ************************************' + err);
			return;
		} else {
			// Split out the command name and the parameter name
			var cmdString = data.split(',');
			var command = cmdString[0].trim();
			var param = cmdString[1].trim();

			switch(command) {
				case 'my-tweets':
					getTweets(); 
					break;

				case 'spotify-this-song':
					spotifyThis(param);
					break;

				case 'movie-this':
					getMovie(param);
					break;
			}
		}
	});
}

