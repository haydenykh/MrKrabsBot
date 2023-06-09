const {
    SlashCommandBuilder,
    CommandInteraction,
    EmbedBuilder,
} = require("discord.js");
const { ExtendedClient } = require("../../Base/index.js");
const moment = require("moment");
const { footer, author } = require("../../Functions/index.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with the latency."),
    /**
     * @param {CommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction, client) {
        const websocketPing = client.ws.ping;
        const now = moment.now();

        const time = moment.duration(2, "seconds").asMilliseconds();

        const pingEmbed = new EmbedBuilder()
            .setTitle(`${client.config.emojis.loading} Pong!`)
            .addFields([
                {
                    name: "WebSocket Ping",
                    value: websocketPing + "ms",
                    inline: true,
                },
                {
                    name: `Interaction Ping`,
                    value: `${client.config.emojis.loading}`,
                    inline: true,
                },
            ])
            .setColor(client.config.embeds.colours.transparent)
            .setAuthor({
                name: author(interaction.user.username),
                iconURL: interaction.user.displayAvatarURL({
                    size: 2048,
                    forceStatic: true,
                    extension: "png",
                }),
            })
            .setFooter({
                text: footer(client.user.username),
                iconURL: client.user.displayAvatarURL({
                    size: 2048,
                    forceStatic: true,
                    extension: "png",
                }),
            });

        interaction
            .reply({
                embeds: [pingEmbed],
            })
            .then((value) => {
                const editedNow = moment.now();
                const editedEmbed = pingEmbed
                    .setTitle(`${client.config.emojis.check} Pong!`)
                    .setFields([
                        {
                            name: "WebSocket Ping",
                            value: websocketPing + "ms",
                            inline: true,
                        },
                        {
                            name: `Interaction Ping`,
                            value: `${editedNow - now}ms`,
                            inline: true,
                        },
                    ]);

                setTimeout(() => {
                    value.edit({
                        embeds: [editedEmbed],
                    });
                }, time);
            });
    },
};
