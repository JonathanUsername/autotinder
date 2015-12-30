import { TinderClient } from 'tinderjs';
import logger from './logger.js';
import db from './db.js';
import socket from './socket.js';

const secret = require("../secrets.json");
const myFBProfileId = secret.id;
const myFBAccessToken = secret.token;

const peopleLimit = 10;
const hitsBeforeLiking = 3;
const repeats = 5;

const seenPeople = {};

const client = new TinderClient();

function test (token, id) {
    client.authorize(token, id, (err) => {
        const ret = err ? err : null;
        console.log(ret);
    })
}

function authorise (token, id, cb) {
    logger.info(token, id);
	client.authorize(token, id, (err) => {
        const ret = err ? err : null;
        cb(ret);
    })	
}

function startScans (fbid) {
    let counter = 0;

    for (let i = 0; i < repeats; i++) {
        findPeople(i, fbid);
    }

    const peopleToShow = [];

    function findPeople (i) {
        logger.info(`Starting scan number ${i}`)
        client.getRecommendations(peopleLimit, (err, data) => {
            countPeople(err, data, fbid);
        });
    }

    function countPeople (err, data) {
        if (err) throw err;
        if (!data.results) {
            logger.error('Empty results!')
            logger.error(data)
            socket.send({
                data: data,
                type: 'err',
                fbid: fbid
            })
            return
        }

        logger.info(`Returned ${data.results.length} results.`)

        data.results.forEach(i => {
                logger.debug(`Found: ${i.name}`);

                // if (db) db.cache.save(i);

                const id = i._id;
                if (seenPeople[id]) {
                    if (seenPeople[id] === hitsBeforeLiking) likePerson(id, fbid);
                    seenPeople[id]++;
                    console.log('seen', id, seenPeople[id], 'times')
                } else {
                    peopleToShow.push(i);
                    seenPeople[id] = 1;
                }
            })

        counter++
        if (counter === repeats) {
            logger.info(`I have seen ${peopleToShow.length} unique people`)
            socket.send({
                data: peopleToShow,
                type: 'seen',
                fbid: fbid
            });
        }
    }

    function likePerson (id) {
        client.like(id, (err, data) => {
            logger.info('Liked', id, data);
            // if (db) db.likes.save(data);

            if (data.matched) {
                socket.send({
                    name: data.name,
                    data: data,
                    type: 'match',
                    fbid: fbid
                })
                logger.info('It\'s a match!');
                client.sendMessage(id, 'Hey ;)');
            }
        })
    }
}


export { authorise, test, startScans };