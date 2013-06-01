var socket = io.connect('/');

socket.on('tweet', function (data) {
    console.log(data);
});