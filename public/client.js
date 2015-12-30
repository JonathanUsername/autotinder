var socket = io();

localStorage.setItem('fbid', getParameterByName('id'))

socket.on('seen', function (msg) {
  $('#details').fadeIn();
  $('#start').text('Again?').fadeIn();
  console.log(msg)
  msg.data.forEach(function(i, index){
    window.setTimeout(function(){
      displayPerson($('#seen_people'), i)
    }, index * 1)
  })
})

socket.on('hello', function(msg) {
  console.log('Test:', msg)
})

socket.on('match', function (msg) {
  console.log(msg)
  $('#details').fadeIn();
  displayPerson($('#matched_people'), msg.data)
})

socket.on('like', function (msg) {
  console.log(msg)
  $('#details').fadeIn();
  displayPerson($('#liked_people'), msg.data)
  $('#likes_remaining').text("Likes remaining: " + msg.likes_remaining)
})

socket.on('err', function (msg) {
  console.log(msg)
  $('#details').hide();
  $('#start').text('Again?').fadeIn();
  var reason = msg.data.reason ? msg.data.reason : JSON.stringify(msg.data);
  $('#error').text('Error:\n\n' + reason).fadeIn();
})

$('#start').click(function(){
  $('#seen_people').empty();
	$('#start').hide();
	$('#error').hide();
	socket.emit('start', {
    fbid: getParameterByName('id'),
    hitQuota: getParameterByName('hitQuota'),
		message: getParameterByName('message'),
		sockid: socket.id
	})
})

function displayPerson (elem, i) {
	elem.append('<li class="person">' + 
		field('p', i.name, 'Name') +
		field('img', i.photos[0].url) +
		field('p', i.bio, 'Bio') +
		(i.common_friends.length > 0 ? field('p', i.common_friends.length, 'Common friends') : '') +
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

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}