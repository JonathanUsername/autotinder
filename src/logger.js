import winston from 'winston';

const logger = new winston.Logger({
    colorize: true,
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'tinderbot.log' })
    ]
});

export default logger;