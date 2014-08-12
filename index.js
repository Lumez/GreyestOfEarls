var request = require('request');
var Twit = require('twit');
var PastebinAPI = require('pastebin-js');
var cheerio = require('cheerio');
var _ = require('underscore.deferred');
var config = require('./config');

var T = new Twit(config.twitter);
var pastebin = new PastebinAPI(config.pastebin);

var roundCommencing = false,
  round = [],
  orders = [],
  counter = 0;

var getRandArrayElement = function(array) {
  var index = Math.floor(array.length*Math.random());
  return array[index];
}

var startTeaRound = function(tweet) {
  round = [];
  orders = [];
  roundCommencing = true;
  counter++;

  console.log('===================');
  console.log('Commence Tea Round!');
  console.log('===================');
  var status = '@' + tweet.user.screen_name + ' has initiated tea round #' + counter + '. Get your orders in within 1 minute!';
  T.post('statuses/update', {status: status}, function(err, data, response) {
    //console.log(data);
  });

  setTimeout(function () {
    stopTeaRound();
  }, 1000 * 60 * 1);
};

var stopTeaRound = function() {
  roundCommencing = false;

  console.log('===============');
  console.log('Round Finished!');
  console.log('===============');

  var order = orders.join('\n');

  pastebin.createPaste(order, 'Round Order', undefined, 1, '10M')
    .then(function (data) {
      // paste succesfully created, data contains the paste url
      var target = getRandArrayElement(round);
      var status = 'Brew me up, @' + target + '! ' + data;
      T.post('statuses/update', {status: status}, function(err, data, response) {
        //console.log(data);
      });
    })
    .fail(function (err) {
      // Something went wrong
      console.log(err);
      T.post('statuses/update', {status: 'Ah No! There was a problem posting this round, start another.'}, function(err, data, response) {
        //console.log(data);
      });
    });
  
};

// Stream

var stream = T.stream('user', {track: '@greyestofearls'});

console.log('Listening for tweets...');

stream.on('tweet', function (tweet) {
  // If the tweet picked up is not from Earl Grey himself, do something about it
  if (tweet.user.screen_name != 'greyestofearls') {
    console.log('Got Tweet from:' + tweet.user.screen_name + '...');

    if (!roundCommencing) {
      startTeaRound(tweet);
    }

    console.log('Adding ' + tweet.user.screen_name + ' to tea round.');
    console.log('Storing order: "' + tweet.text + '"');
    round.push(tweet.user.screen_name);
    orders.push(tweet.user.screen_name + ' - "' + tweet.text + '"');
  }
})