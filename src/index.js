import * as _ from 'lodash';
import express from 'express';
import Path from 'path';
import ejs from 'ejs';
import Hapi from 'hapi';
import logger from './logger.js';
import { authorise, startScans } from './tinder.js';
import socket from './socket.js'

const server = new Hapi.Server();

server.connection({ 
  port: process.env.PORT || 3000 
});

socket.register(server.listener)

server.register(require('inert'), (err) => {

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file('public/index.html');
    }
  });

  server.route({
    method: 'GET',
    path: '/success',
    handler: function (request, reply) {
      var token = request.query.token;
      var id = request.query.id;
      logger.info(`TOKEN is : ${token}`);
      logger.info(`ID is : ${id}`);
      try {
        authorise(token, id, (err) => {
          if (!err) {
            reply.file('public/liking.html');
          } else {
            authError(reply, err);
          }
        });
      } catch(e) {
        authError(e);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/start',
    handler: function (request, reply) {
      var id = request.query.id;
      logger.info(`ID is : ${id}`);
      startScans(id);
    }
  });

  server.route({
    method: 'GET',
    path: '/{file*}',
    config: {
      handler: {
        directory: {
          path:  'public',
          listing: false
        }
      }
    }
  });

  server.start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
  });

});

function authError (reply, e) {
  logger.error(e);
  reply('Error authenticating:', JSON.stringify(e, null, 2), 'Try Logging in again.');
}


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



