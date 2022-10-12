import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import dotenv from 'dotenv';
import requestIP from 'request-ip';
dotenv.config();

const { createLogger, transports, format } = winston;
const { combine, timestamp, json, colorize, printf, label, simple } = format;

const printFormat = printf((info) => {
  return `${info.timestamp} [${info.label}] ${info.message.method}/ ${info.level} : ${info.message.type} - ${info.message.ip}`;
});

const printLogFormat = {
  file: combine(
    label({
      label: 'Pinggu',
    }),

    timestamp({
      format: 'YYYY-MM-DD HH:mm:dd',
    }),
    printFormat,
  ),
};

const options = {
  dailyInfo: new winstonDaily({
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    filename: `%DATE%.log`,
    dirname: './logs',
    format: printLogFormat.file,
    maxFiles: 60,
  }),
  dailyError: new winstonDaily({
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    filename: `%DATE%.error.log`,
    dirname: './logs/error',
    format: printLogFormat.file,
    maxFiles: 60,
  }),
};

const logger = createLogger({
  transports: [options.dailyInfo, options.dailyError],
});

export default logger;
