import mongojs from 'mongojs';
import logger from './logger.js';

let db;
try {
    db = mongojs('tinder', ['cache', 'likes']);
} catch(e) {
    logger.error(e, 'Error connecting to mongo. Not caching.');
    db = false;
}

export default db;