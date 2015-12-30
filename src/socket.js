import socket from 'socket.io';
import { startScans } from './tinder.js';

let io;
const clients = {}; // Indexed by fb profile id
const sockets = {}; // Indexed by socket id

function Messenger () {
	this.register = (listener) => {
		io = require('socket.io')(listener);
		io.on('connection', function(socket){
		  console.log('a user connected');
		  sockets[socket.id] = socket;
		  socket.on('disconnect', function(){
		    console.log('user disconnected');
		  });
			socket.on('start', (data) => {
				console.log('start', JSON.stringify(data))
				clients[data.fbid] = data.sockid;
				startScans(data.fbid);
			})
		});
	}

	this.send = (data) => {
		const sockid = clients[data.fbid];
		sockets[sockid].emit(data.type, data)
	}
};

const messenger = new Messenger();

export default messenger;