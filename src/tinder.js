import { TinderClient } from 'tinderjs';
import logger from './logger.js';
import db from './db.js';

const secret = require("../secrets.json");
const myFBProfileId = secret.id;
const myFBAccessToken = secret.token;

const peopleLimit = 10;
const hitsBeforeLiking = 3;
const repeats = 2;

const seenPeople = {};

const client = new TinderClient();

function authorise (cb) {
    logger.info(myFBAccessToken, myFBProfileId);
	client.authorize(myFBAccessToken, myFBProfileId, (err) => {
        const ret = err ? err : null;
        cb(ret);
    })	
}

function startScans () {
    for (let i = 0; i < repeats; i++) {
        findPeople(i);
    }
}

function findPeople (i) {
    logger.info(`Starting scan number ${i}`)
    client.getRecommendations(peopleLimit, countPeople);
}

function countPeople (err, data) {
    if (err) throw err;

    logger.info(`Returned ${data.results.length} results.`)

    data.results.forEach(i => {
            logger.debug(`Found: ${i.name}`);

            if (db) db.cache.save(i);

            const id = i.id;
            if (seenPeople[id]) {
                if (seenPeople[id] === hitsBeforeLiking) likePerson(id);
                seenPeople[id]++;
            } else {
                seenPeople[id] = 1;
            }
        })

    logger.info(`These are the people I've seen: ${seenPeople}`)
}

function likePerson (id) {
    client.like(id, (err, data) => {
        logger.info('Liked', id, data);
        if (db) db.likes.save(data);

        if (data.matched) {
            logger.info('It\'s a match!');
            client.sendMessage(id, 'Hey ;)');
        }
    })
}

export { authorise };