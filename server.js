var express = require("express");
var twitter = require("twitter");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {log: false});

app.use(express.logger());

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({
        dumpExceptions: true, 
        showStack: true
    }));
    app.use(app.router);
});

var twit = new twitter({
    consumer_key: 'GZqfJsBQM80uRyuGtVcTkw',
    consumer_secret: 'WqpulpVjUN0WAzejAFzwRiqXoSm98ksYYpe2vPusQ',
    access_token_key: '47104104-lnUI4JZoaQPlsXo3soZNnnnz14pqcwYUzaD9HiDHt',
    access_token_secret: 'gOwqsLIiybsyq9AY8jP8lRZJ7inr3oLN1aUYmZwTJ8A'
});

twit.stream('statuses/filter', { track: 'restaurants', locations: '-122.75,36.8,-121.75,37.8' }, function(stream) {
    console.log('listening for keywords');
    stream.on('data', function (data) {
        console.log('i sent a tweet to the client', data);
        io.sockets.emit('tweet', data.text);
    });
});

app.get('/', function(request, response) {
    response.redirect('/index.html');
});

var port = process.env.PORT || 5000;
server.listen(port, function() {
    console.log("Listening on " + port);
});