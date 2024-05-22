import winston from 'winston';
import dotenv from 'dotenv'

dotenv.config()

const customLevelOptions = {
    levels: {
        debug: 5,
        http: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0,
    },
    colors: {
        debug: 'blue',
        http: 'green',
        info: 'cyan',
        warn: 'yellow',
        error: 'red',
        fatal: 'black',
    },
};

const ENVIRONMENT = process.env.ENVIRONMENT || "production";


const checkEnvironment = () => {
    if(ENVIRONMENT.toUpperCase() === 'DEVELOPMENT') {
        console.log('Logger is in development mode');
        return devLogger;
    }
    return prodLogger;
};

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [new winston.transports.Console( { level: 'debug' })]
});

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports:[
        new winston.transports.Console( { level: 'http' }),
        new winston.transports.File({ 
            filename: './errors.log',
            level: 'warn' 
        })
    ]
});

export const addLogger = (req, res, next) => {
    req.logger = checkEnvironment();
    req.logger.http(`${req.method} in ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}