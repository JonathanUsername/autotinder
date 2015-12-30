import winston from 'winston';

const logger = new winston.Logger({
    colorize: true,
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'autotinder.log' })
    ]
});

export default logger;