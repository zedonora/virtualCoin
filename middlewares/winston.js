import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import moment from "moment";
import path from "path";

function timeStampFormat() {
  return moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ");
}

// Create the logger
const logger = winston.createLogger({
  transports: [
    new winstonDaily({
      name: "info-file",
      filename: path.join(__dirname, "/log/server_%DATE%.log"),
      datePattern: "YYYY-MM-DD-HH",
      colorize: false,
      maxsize: 50000000,
      maxFiles: 1000,
      level: "info",
      showLevel: true,
      json: false,
      timestamp: timeStampFormat
    }),
    new winston.transports.Console({
      name: "debug-console",
      colorize: true,
      level: "debug",
      showLevel: true,
      json: false,
      timestamp: timeStampFormat
    })
  ],
  exceptionHandlers: [
    new winstonDaily({
      name: "exception-file",
      filename: path.join(__dirname, "/log/exception_%DATE%.log"),
      datePattern: "YYYY-MM-DD-HH",
      colorize: false,
      maxsize: 50000000,
      maxFiles: 1000,
      level: "error",
      showLevel: true,
      json: false,
      timestamp: timeStampFormat
    }),
    new winston.transports.Console({
      name: "exception-console",
      colorize: true,
      level: "debug",
      showLevel: true,
      json: false,
      timestamp: timeStampFormat
    })
  ]
});

export default logger;
