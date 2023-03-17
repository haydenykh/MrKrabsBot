const { Events } = require("discord.js");
const { ExtendedClient } = require("../../Base/index.js");
const chalk = require("chalk");

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {ExtendedClient} client
     */
    async execute(client) {
        console.info(chalk.green(`${client.user.tag} is up and ready!`));
    },
};
