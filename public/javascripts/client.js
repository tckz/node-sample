
jQuery(function() {

var socket = io.connect();

var count_messages = 0;

socket.on('msg push', function(message) {
	$('#count').text(message.count);
	if (message.text) {
		if (count_messages > 10) {
			$('#msgs').empty();
			count_messages = 0;
		}

		$('#msgs').append($("<div>").text(message.text));
		count_messages++;
	}
});


var input = $("#message");
input.val("");
input.focus();
$("#form").submit(function(){
	socket.emit("msg client", input.val());
	input.val("");
	return false;
});

});

