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
        if (!interaction.isUserContextMenuCommand()) return;

        const userContextMenu = client.userContextMenus.get(
            interaction.customId
        );

        if (!userContextMenu) {
            return interaction.reply({
                content: `Context menu either outdated or unavailable.`,
            });
        }

        if (
            userContextMenu.developerMode &&
            interaction.user.id !== process.env.OWNER_ID
        ) {
            return interaction.reply({
                content: `You are not allowed to use this context menu.`,
                ephemeral: true,
            });
        }

        userContextMenu.execute(interaction, client);
        /* end */
    },
};
