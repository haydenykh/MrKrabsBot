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
            interaction.reply({
                content: `Button interaction either outdated or unavailable..`,
            });
        }

        button.execute(interaction, client);
        /* end */
    },
};
