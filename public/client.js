var socket = io();

socket.on('seen', function (msg) {
	$('#details').show();
	msg.data.forEach(function(i, index){
		window.setTimeout(function(){
			display($('#seen_people'), i)
		}, index * 200)
	})
})

socket.on('match', function (msg) {
	$('#details').show();
	display($('#matched_people'), msg.data)
})

socket.on('err', function (msg) {
	$('#error').text('Error:\n\n' + JSON.stringify(msg.data)).show()
})

$('#start').click(function(){
	$('#seen_people').empty();
	$('#error').hide();
	socket.emit('start', {
		fbid: location.search.split('=')[2],
		sockid: socket.id
	})
})

function display (elem, i) {
	elem.append('<li class="person">' + 
		field('p', i.name, 'Name') +
		field('img', i.photos[0].url) +
		field('p', i.bio, 'Bio') +
		i.common_friends.length > 0 ? field('p', i.common_friends.length, 'Common friends') : '' +
  	'</li>');
	function field (tag, field, label) {
		var fulllabel;
		if (tag == 'img') {
			return '<img src=' + field + ' />'
		} 
		if (label) {
			fulllabel = '<h3>' + label + ': </h3>';
		} else {
			fulllabel = ''
		}
		return fulllabel + '<' + tag + '>' + field + '</' + tag + '>'
	}
}