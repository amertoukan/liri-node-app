require('dotenv').config();
var fs = require ('fs'); 
var request = require('request');
var inquire = require ('inquirer');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
//Twitter Integration
var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
});

//Spotify Integration
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});
console.log(keys.spotify);



inquire.prompt([
    {
        type:'input',
        name: 'userInput',
        message:'What you like to access Twitter or Spotify?'
    }
]).then (function (action){
    if (action.userInput === "Twitter"){
        client.get ('favorites/list', function (error, data, response){
            if (error) {console.log(error);}
            console.log(JSON.stringify(data, null, 2));
            console.log(response);
    });
    }  
    
    
else if (action.userInput === "Spotify"){ 
            inquire.prompt([
            {
                type:'input',
                name:'songName',
                message: 'Enter song name '
            }
        ]) .then (function (response){
            var song = (JSON.stringify(response));
            console.log(song);
        spotify.search({type:'track', query: song}, function (err, data){
            if (err){
                return console.log('Spotify error: '+ err)
            }
            
            console.log(data);

});
})
}
});

