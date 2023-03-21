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
        /* by RoaldDahl */
        // * git repo (https://github.com/RoaldDahl/Button-Handler)
        // * got from kajdev server
        if (!interaction.isButton()) return;

        const button = client.buttons.get(interaction.customId);

        if (!button) {
            return interaction.reply({
                content: `Button interaction either outdated or unavailable.`,
            });
        }

        if (
            button.developerMode &&
            interaction.user.id !== process.env.OWNER_ID
        ) {
            return interaction.reply({
                content: `You are not allowed to use this button.`,
                ephemeral: true,
            });
        }

        button.execute(interaction, client);
        /* end */
    },
};
