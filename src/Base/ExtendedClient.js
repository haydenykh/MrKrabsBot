const { Client, ClientOptions } = require("discord.js");
const chalk = require("chalk");

class ExtendedClient extends Client {
    /**
     * @param {ClientOptions} options
     */
    constructor(options) {
        super(options);
    }

    /**
     * @param {string | undefined} token
     */
    async start(token) {
        console.time(`Client Log In`);

        await this.login(token)
            .then((_value) => {
                console.info(
                    chalk.green(`[client] Logged in as ${this.user.tag}!`),
                    chalk.italic.grey(`(ID: ${this.user.id})`)
                );
            })
            .catch((reason) => {
                const reason_ = chalk.red(reason);
                throw reason_;
            });

        console.timeEnd(`Client Log In`);
    }
}

module.exports = { ExtendedClient };
