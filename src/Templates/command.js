const { SlashCommandBuilder, CommandInteraction } = require("discord.js");
const { ExtendedClient } = require("../../Base/index.js");

module.exports = {
    data: new SlashCommandBuilder().setName("").setDescription(""),
    /**
     * @param {CommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction, client) {},
};
