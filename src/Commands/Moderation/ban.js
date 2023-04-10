const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    bold,
    codeBlock,
} = require("discord.js");
const { ExtendedClient } = require("../../Base/index.js");
const { footer, author } = require("../../Functions/index.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a member out of a server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption((option) => {
            return option
                .setName(`target`)
                .setDescription(`The user you want to ban.`)
                .setRequired(true);
        })
        .addStringOption((option) => {
            return option
                .setName(`reason`)
                .setDescription(`The reason for the ban.`)
                .setRequired(false)
                .setMinLength(1);
        })
        .addBooleanOption((option) => {
            return option
                .setName(`delete-messages`)
                .setDescription(
                    `Deletes messages sent by the target in the past 7 days.`
                )
                .setRequired(false);
        }),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction, client) {
        const { options, guild, member: member_, user } = interaction;

        const target = options.getUser(`target`);
        const reason = options.getString(`reason`) || `No reason provided.`;
        const deleteMessages = options.getBoolean(`delete-messages`) || false;

        const member = guild.members.cache.get(target.id);

        if (member.roles.highest.position >= member_.roles.highest.position) {
            const embed = new EmbedBuilder()
                .setTitle(
                    `${client.config.emojis.warning} ${client.config.messages.action.warning}`
                )
                .setDescription(
                    `<@!${member.id}> has either higher or same role as you in this server.`
                )
                .setFooter({
                    text: footer(
                        client.user.username,
                        client.user.discriminator
                    ),
                    iconURL: client.user.displayAvatarURL({
                        size: 2048,
                        forceStatic: true,
                        extension: "png",
                    }),
                })
                .setAuthor({
                    name: author(user.username, user.discriminator),
                    iconURL: user.displayAvatarURL({
                        size: 2048,
                        forceStatic: true,
                        extension: "png",
                    }),
                })
                .setColor(client.config.embeds.colours.warning)
                .setTimestamp();

            return interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }

        const banEmbed = new EmbedBuilder()
            .setTitle(
                `${client.config.emojis.check} ${client.config.messages.action.success}`
            )
            .setColor(client.config.embeds.colours.success)
            .setFooter({
                text: footer(client.user.username, client.user.discriminator),
                iconURL: client.user.displayAvatarURL({
                    size: 2048,
                    forceStatic: true,
                    extension: "png",
                }),
            })
            .setAuthor({
                name: author(user.username, user.discriminator),
                iconURL: user.displayAvatarURL({
                    size: 2048,
                    forceStatic: true,
                    extension: "png",
                }),
            })
            .addFields([
                {
                    name: `Reason`,
                    value: `${reason}`,
                    inline: true,
                },
            ]);

        const userEmbed = new EmbedBuilder()
            .setTitle(`Banned`)
            .setDescription(
                `You have been banned from ${bold(`${guild.name}`)}.`
            )
            .setColor(client.config.embeds.colours.transparent)
            .setAuthor({
                name: author(user.username, user.discriminator),
                iconURL: user.displayAvatarURL({
                    size: 2048,
                    forceStatic: true,
                    extension: "png",
                }),
            })
            .setFooter({
                text: footer(client.user.username, client.user.discriminator),
                iconURL: client.user.displayAvatarURL({
                    size: 2048,
                    forceStatic: true,
                    extension: "png",
                }),
            })
            .addFields([
                {
                    name: `Reason`,
                    value: `${reason}`,
                    inline: true,
                },
            ]);

        await member
            .ban({ days: deleteMessages ? 604800 : 0, reason })
            .then((value) => {
                banEmbed
                    .setDescription(`Successfully banned <@!${value.id}>.`)
                    .setTimestamp();
                userEmbed.setTimestamp();
                value.send({
                    embeds: [userEmbed],
                });
                return interaction.reply({ embeds: [banEmbed] });
            })
            .catch((reason) => {
                const errorEmbed = new EmbedBuilder()
                    .setTitle(
                        `${client.config.emojis.x_mark} ${client.config.messages.action.failed}`
                    )
                    .setDescription(
                        `${client.config.messages.error}\n${codeBlock(
                            reason.message
                        )}`
                    )
                    .setColor(client.config.embeds.colours.error)
                    .setAuthor({
                        name: author(user.username, user.discriminator),
                        iconURL: user.displayAvatarURL({
                            size: 2048,
                            forceStatic: true,
                            extension: "png",
                        }),
                    })
                    .setFooter({
                        text: footer(
                            client.user.username,
                            client.user.discriminator
                        ),
                        iconURL: client.user.displayAvatarURL({
                            size: 2048,
                            forceStatic: true,
                            extension: "png",
                        }),
                    });

                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true,
                });
            });
    },
};
