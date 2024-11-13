/* eslint-disable typescript/naming-convention */
import type { LoggerOptions } from "@ptkdev/logger";
import Logger from "@ptkdev/logger";
import { debugMode } from "./env.js";

const options: LoggerOptions = {
    language: "en",
    colors: true,
    debug: debugMode ?? false,
    info: true,
    warning: true,
    error: true,
    sponsor: true,
    write: true,
    type: "log",
    rotate: {
        size: "10M",
        encoding: "utf8"
    },
    path: {
        debug_log: "./logs/debug.log",
        error_log: "./logs/error.log"
    }
};

const logger = new Logger(options);

export default logger;