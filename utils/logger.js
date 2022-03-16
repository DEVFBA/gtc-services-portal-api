var winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

var fecha = new Date();
var dia = fecha.getDate()

const transport = new DailyRotateFile(
    {
        filename: 'logs/' +  "server-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: false,
        maxSize: "20m",
        maxFiles: "365d",
    }
);

const logFormat = winston.format.combine( 
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
     info => `${info.timestamp} ${info.level}: ${info.message}`,
),);

const logger = winston.createLogger({
    format:logFormat,
    transports: [
        transport
]});

module.exports = logger