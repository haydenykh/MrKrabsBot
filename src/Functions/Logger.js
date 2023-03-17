const pino = require("pino");
const { Response } = require("node-fetch");
const { DiscordAPIError } = require("discord.js");
const config = require("../config.json");

// * Made by KevinNovak (https://github.com/KevinNovak/Discord-Bot-TypeScript-Template/blob/master/src/services/logger.ts)

const logger = pino(
    {
        formatters: {
            level: (label) => {
                return {
                    level: label,
                };
            },
        },
    },
    config.logging.pretty
        ? pino.transport({
              target: "pino-pretty",
              options: {
                  colorize: true,
                  ignore: "pid,hostname",
                  translateTime: "yyyy-mm-dd HH:MM:ss.l",
              },
          })
        : undefined
);

/**
 * @param {string} message
 * @param {any} [object]
 * @returns {void}
 */
function InfoLogger(message, object) {
    object ? logger.info(object, message) : logger.info(message);
}

/**
 * @param {string} message
 * @param {any} [object]
 * @returns {void}
 */
function WarnLogger(message, object) {
    object ? logger.warn(object, message) : logger.warn(message);
}

/**
 * @param {string} message
 * @param {any} [object]
 * @returns {Promise<void>}
 */
async function ErrorLogger(message, object) {
    if (!object) {
        logger.error(message);
        return;
    }

    if (typeof object === "string") {
        logger
            .child({
                message: object,
            })
            .error(message);
    } else if (object instanceof Response) {
        /**
         * @type {string}
         */
        let resText;

        try {
            resText = await object.text();
        } catch (error) {
            // Ignore
        }
        logger
            .child({
                path: object.url,
                statusCode: object.status,
                statusName: object.statusText,
                headers: object.headers.raw(),
                body: resText,
            })
            .error(message);
    } else if (object instanceof DiscordAPIError) {
        logger
            .child({
                message: object.message,
                code: object.code,
                statusCode: object.status,
                method: object.method,
                url: object.url,
                stack: object.stack,
            })
            .error(message);
    } else {
        logger.error(object, message);
    }
}

module.exports = { ErrorLogger, InfoLogger, WarnLogger };
