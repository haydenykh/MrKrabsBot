const { Client, ClientOptions, Collection } = require("discord.js");
const chalk = require("chalk");
const {
    loadEvents,
    loadCommands,
    loadButtons,
    loadStringSelects,
} = require("../Handlers/index.js");

class ExtendedClient extends Client {
    /**
     * @param {ClientOptions} options
     */
    constructor(options) {
        super(options);
    }

    commands = new Collection();
    events = new Collection();
    stringSelects = new Collection();
    buttons = new Collection();
    config = require(`../config.json`);

    /**
     * @param {string | undefined} token
     */
    async start(token) {
        console.time(`Client Log In`);

        await this.login(token)
            .then(() => {
                loadEvents(this);
                loadCommands(this);
                loadButtons(this);
                loadStringSelects(this);

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
