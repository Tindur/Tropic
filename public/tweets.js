$(document).ready(function () {
	socket.on('tweet', function (data) {
	    console.log(data);
	});
});