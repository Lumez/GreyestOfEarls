var request = require('request');
var Twit = require('twit');
var cheerio = require('cheerio');
var _ = require('underscore.deferred');
var T = new Twit(require('./config'));

var roundCommencing = false,
  round = [];

var getRandArrayElement = function(array) {
  var index = Math.floor(array.length*Math.random());
  return array[index];
}

var startTeaRound = function(tweet) {
  roundCommencing = true;
  console.log('===================');
  console.log('Commence Tea Round!');
  console.log('===================');
  var status = '@' + tweet.user.screen_name + ' has initiated a tea round. Get your orders in within 5 minutes!';
  T.post('statuses/update', {status: status}, function(err, data, response) {
    console.log(data);
  });

  setTimeout(function () {
    stopTeaRound();
  }, 1000 * 60 * 1);
};

var stopTeaRound = function() {
  roundCommencing = false;
  http://pastebin.com/api/api_post.php
  var target = getRandArrayElement(round);
  var status = 'Brew me up, @' + target + '!'
  T.post('statuses/update', {status: status}, function(err, data, response) {
    console.log(data);
  });
  round = [];
}

// Stream

var stream = T.stream('user', {track: '@greyestofearls'});

console.log('Listening for tweets...');

stream.on('tweet', function (tweet) {
  console.log('Got Tweet from:' + tweet.user.screen_name + '...');
  if (!roundCommencing) {
    startTeaRound(tweet);
  } else if (tweet.user.screen_name == 'greyestofearls') {
    console.log('Adding ' + user + 'to tea list.');
    round.push(tweet.user.screen_name);
  }
})