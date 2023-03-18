const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with the latency."),
    async execute(interaction) {
        await interaction.reply({
            content: `Pong! Latency is ${interaction.client.ws.ping}ms.`,
            ephemeral: true,
        });
    },
};
