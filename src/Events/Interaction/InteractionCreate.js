const { Events, CommandInteraction } = require("discord.js");
const { ExtendedClient } = require("../../Base/index.js");
const chalk = require("chalk");

module.exports = {
    name: Events.InteractionCreate,
    /**
     * @param {CommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction, client) {
        /* by kajdev */
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            interaction.reply({
                content: `Command not found.`,
                ephemeral: true,
            });
        }

        command.execute(interaction, client);
        /* end */
    },
};
