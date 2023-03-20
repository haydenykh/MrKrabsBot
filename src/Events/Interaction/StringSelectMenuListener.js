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
        // ! with some changes
        if (!interaction.isStringSelectMenu()) return;

        const stringSelects = client.stringSelects.get(interaction.customId);

        if (!stringSelects) {
            interaction.reply({
                content: `StringSelectMenu interaction either outdated or unavailable.`,
            });
        }

        stringSelects.execute(interaction, client);
        /* end */
    },
};
