var express = require("express");
var twitter = require("twitter");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {log: false});
var mainstream;

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

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 86400); 
});

var twit = new twitter({
    consumer_key: '<key>',
    consumer_secret: '<secret>',
    access_token_key: '<token-key>',
    access_token_secret: '<token-secret>'
});

io.sockets.on("connection", function (socket) {
    socket.on('create stream', function (data) {
        // console.log(data);
        if (mainstream !== undefined) {
            mainstream.destroy();
            console.log("destroying previous mainstream");
        }
        twit.stream('statuses/filter', { locations: data.lat1 + ',' + data.lng1 + ',' + data.lat2 + ',' + data.lng2 }, function(stream) {
            mainstream = stream;

            console.log('listening for keywords');
            try {
                mainstream.on('data', function (data) {
                    // console.log('i sent a tweet to the client', data);
                    io.sockets.emit('tweet', data);
                });
            }
            catch (err) {
                console.log(err);
            }
            var keyword = data.keyword;
            console.log('listening for keywords', data.keyword);
            mainstream.on('data', function (data) {
                if(keyword === undefined || keyword === '' )
                    io.sockets.emit('tweet', data);
                else if(data.text && data.text.indexOf(keyword) != -1)
                    io.sockets.emit('tweet', data);
            });
        });
    });
});

app.get('/', function(request, response) {
    response.redirect('/index.html');
});

var port = process.env.PORT || 5000;
server.listen(port, function() {
    console.log("Listening on " + port);
});
