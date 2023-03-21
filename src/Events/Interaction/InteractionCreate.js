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
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            return interaction.reply({
                content: `Command interaction either outdated or unavailable.`,
                ephemeral: true,
            });
        }

        if (
            command.developerOnly &&
            interaction.user.id !== process.env.OWNER_ID
        ) {
            return interaction.reply({
                content: `You are not allowed to use this command.`,
                ephemeral: true,
            });
        }

        command.execute(interaction, client);
        /* end */
    },
};
