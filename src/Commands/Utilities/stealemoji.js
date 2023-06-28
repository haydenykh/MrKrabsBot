const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction,
    codeBlock,
} = require("discord.js");
const { ExtendedClient } = require("../../Base/index.js");
const { default: axios } = require("axios");
const { footer, author } = require("../../Functions/index.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stealemoji")
        .setDescription("Steal an emoji from a server.")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageEmojisAndStickers
        )
        .addStringOption((option) => {
            return option
                .setName(`emoji`)
                .setDescription(`The emoji you want to steal from the server`)
                .setRequired(true)
                .setMinLength(3);
        })
        .addStringOption((option) => {
            return option
                .setName(`name`)
                .setDescription(`The name of the new emoji.`)
                .setRequired(true)
                .setMinLength(1);
        }),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction, client) {
        const { options } = interaction;

        let emoji = options.getString(`emoji`)?.trim();
        const name = options.getString(`name`);

        if (emoji.startsWith("<") && emoji.endsWith(">")) {
            const id = emoji.match(/\d{15,}/g)[0];
            const type = await axios
                .get(`https://cdn.discordapp.com/emojis/${id}.gif`)
                .then((value) => {
                    if (value) {
                        return "gif";
                    } else {
                        return "png";
                    }
                })
                .catch((reason) => {
                    return "png";
                });

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;
        }

        if (!emoji.startsWith("http")) {
            return interaction.reply({
                content: `You can't even steal default emojis, they can be used everywhere.`,
                ephemeral: true,
            });
        }

        if (!emoji.startsWith("https")) {
            return interaction.reply({
                content: `You can't even steal default emojis, they can be used everywhere.`,
                ephemeral: true,
            });
        }

        const stoleEmbed = new EmbedBuilder()
            .setTitle(`${client.config.emojis.check} Action Success`)
            .setColor(client.config.embeds.colours.success)
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
        interaction.guild.emojis
            .create({ attachment: `${emoji}`, name: `${name}` })
            .then((value) => {
                stoleEmbed.setDescription(
                    `Successfully stole ${value} into the server.`
                );

                return interaction.reply({
                    embeds: [stoleEmbed],
                });
            })
            .catch((reason) => {
                return interaction.reply({
                    content: `${client.config.messages.error}\n${codeBlock(
                        reason
                    )}`,
                    ephemeral: true,
                });
            });
    },
};
