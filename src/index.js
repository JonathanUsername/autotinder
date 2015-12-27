import * as _ from 'lodash';
import express from 'express';
import Path from 'path';
import ejs from 'ejs';
import logger from './logger.js';
import { authorise } from './tinder.js';
import Hapi from 'hapi';

const server = new Hapi.Server();

server.connection({ port: 3000 });

var io = require('socket.io')(server.listener);

server.register(require('inert'), (err) => {

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      console.log('hit')
      reply.file('public/liking.html');
    }
  });

  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

  server.start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
  });

});



// server.register(require('inert'), (err) => {

//     if (err) {
//         throw err;
//     }

//     server.route({
//         method: 'GET',
//         path: '/',
//         handler: function (request, reply) {
//             reply.file('liking.html');
//         }
//     });

//     server.start((err) => {

//         if (err) {
//             throw err;
//         }

//         console.log('Server running at:', server.info.uri);
//     });
// });

// app.get('/', 
//     function handler (req, res) {
//         logger.info('Already logged in, redirecting...')
//         // logger.info(req, res);
//         res.render('index');
// });

// app.get('/success', 
//     function (req, res) {
//         logger.info(`TOKEN is : ${req.query.token}`);
//         logger.info(`ID is : ${req.query.id}`);
//         try {
//             res.render('liking.html')
//         } catch(e) {
//             res.send(JSON.stringify(e, null, 2) + 'That access token is borked. Try logging in again.')
//         }
//     }
// );



