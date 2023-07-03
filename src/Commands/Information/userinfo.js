const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    EmbedBuilder,
    ComponentType,
} = require("discord.js");
const { ExtendedClient } = require("../../Base/index.js");
const { author, footer } = require("../../Functions/index.js");
const { duration } = require("moment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Gets the user's info.")
        .addUserOption((option) => {
            return option
                .setName(`user`)
                .setDescription("The user to get info for.")
                .setRequired(false);
        })
        .addBooleanOption((option) => {
            return option
                .setName(`ephemeral`)
                .setDescription(
                    `Makes the message hidden (only viewable by you.)`
                )
                .setRequired(false);
        }),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction, client) {
        /* example from DEVELOPER DONALD: https://youtu.be/BYx7NNodpgc 
           with changes */
        const { options, guild } = interaction;
        const { config, user: user__ } = client;
        const { embeds, emojis } = config;

        const user = options.getUser(`user`) || interaction.user;
        const ephemeral_ = options.getBoolean(`ephemeral`) || false;

        const formatter = new Intl.ListFormat("en-GB", {
            style: "long",
            type: "conjunction",
        });

        if (user) {
            const { flags, username } = user;
            const member = guild.members.cache.get(user.id);

            const row = (state) =>
                new ActionRowBuilder().addComponents([
                    new StringSelectMenuBuilder()
                        .setCustomId(`userinfo`)
                        .setPlaceholder(
                            `Select what type of information to get.`
                        )
                        .setDisabled(state)
                        .addOptions([
                            new StringSelectMenuOptionBuilder()
                                .setLabel(`User Information`)
                                .setDescription(`The user's information.`)
                                .setEmoji(`<:discord:314003252830011395>`)
                                .setValue(`userinfo-user`),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(`Roles`)
                                .setDescription(`The roles of the member.`)
                                .setEmoji(`<:role:808826577785716756>`)
                                .setValue(`userinfo-roles`),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(`Member Information`)
                                .setDescription(`The member's information.`)
                                .setEmoji(`<:members:658538493470965787>`)
                                .setValue(`userinfo-member`),
                        ]),
                ]);

            if (member == null) {
                return interaction.reply({
                    content: "Member not found in guild.",
                    ephemeral: true,
                });
            }

            await user.fetch();

            const statusType = {
                idle: emojis.away,
                dnd: emojis.dnd,
                online: emojis.online,
                offline: emojis.offline,
            };

            const activityType = [
                "Playing",
                "Streaming",
                "Listening to",
                "Watching",
                "Custom",
                "Competing in",
            ];

            const clientType = [
                { name: "desktop", text: "Computer", emoji: "💻" },
                { name: "mobile", text: "Phone", emoji: "📱" },
                { name: "web", text: "Website", emoji: "🌐" },
                { name: "offline", text: "Offline", emoji: "⌛" },
            ];

            // from https://discord-api-types.dev/api/discord-api-types-v10/enum/UserFlags
            const badges = {
                ActiveDeveloper: { name: "Active Developer", emoji: "" },
                BugHunterLevel1: {
                    name: "Bug Hunter Level 1",
                    emoji: "<:bughunter:585765206769139723>",
                },
                BugHunterLevel2: {
                    name: "Bug Hunter Level 2",
                    emoji: "<:goldbughunter:853274684337946648>",
                },
                CertifiedModerator: {
                    name: "Certified Moderator",
                    emoji: "<:certifiedmod:853274382339670046>",
                },
                HypeSquadOnlineHouse1: {
                    name: "House of Bravery",
                    emoji: "<:bravery:585763004218343426>",
                },
                HypeSquadOnlineHouse2: {
                    name: "House of Brilliance",
                    emoji: "<:brilliance:585763004495298575>",
                },
                HypeSquadOnlineHouse3: {
                    name: "House of Balance",
                    emoji: "<:balance:585763004574859273>",
                },
                Hypesquad: {
                    name: "Hypesquad Events Member",
                    emoji: "<:hypesquad_events:585765895939424258>",
                },
                Partner: {
                    name: "Partnered Server Owner",
                    emoji: "<:partnernew:754032603081998336>",
                },
                PremiumEarlySupporter: {
                    name: "Early Nitro Supporter",
                    emoji: "<:supporter:585763690868113455>",
                },
                Staff: {
                    name: "Discord Employee",
                    emoji: "<:stafftools:314348604095594498>",
                },
                VerifiedBot: { name: "Verified Bot", emoji: "" },
                VerifiedDeveloper: {
                    name: "Early Verified Bot Developer",
                    emoji: "<:verifiedbotdev:853277205264859156>",
                },
            };

            const maxDisplayRoles = (roles_, maxFieldLength = 1024) => {
                let totalLength = 0;
                const result = [];

                for (const role of roles_) {
                    const roleString = `<@${role.id}>`;

                    if (roleString.length + totalLength > maxFieldLength) break;

                    totalLength += roleString.length + 1;
                    result.push(roleString);
                }

                return result.length;
            };

            const sortedRoles = member.roles.cache
                .map((role) => role)
                .sort((a, b) => b.position - a.position)
                .slice(0, member.roles.cache.size - 1);

            const clientStatus =
                member.presence?.clientStatus instanceof Object
                    ? Object.keys(member.presence.clientStatus)
                    : "offline";
            const userFlags = flags.toArray();

            const deviceFilter = clientType.filter((device) =>
                clientStatus.includes(device.name)
            );
            const devices = !Array.isArray(deviceFilter)
                ? new Array(deviceFilter)
                : deviceFilter;

            const userEmbed = new EmbedBuilder()
                .setTitle(
                    `<:discord:314003252830011395> ${user.username}'s Information`
                )
                .setColor(user.hexAccentColor || embeds.colours.transparent)
                .addFields([
                    {
                        name: "Username",
                        value: `@${user.username}`,
                        inline: true,
                    },
                    {
                        name: "Hex Accent Colour",
                        value: user.hexAccentColor
                            ? `\`${user.hexAccentColor}\``
                            : `None.`,
                        inline: true,
                    },
                    {
                        name: "Global Name",
                        value: user.globalName ? `${user.globalName}` : `None.`,
                        inline: true,
                    },
                    {
                        name: "Devices",
                        value: devices
                            .map((device) => `${device.emoji} ${device.text}`)
                            .join("\n"),
                        inline: true,
                    },
                    {
                        name: "Created At",
                        value: `<t:${parseInt(
                            user.createdTimestamp / 1000
                        )}:F>`,
                    },
                    {
                        name: "Badges",
                        value: userFlags.length
                            ? formatter.format(
                                  userFlags.map(
                                      (flag) =>
                                          `${badges[flag].emoji} **${badges[flag].name}**`
                                  )
                              )
                            : `None.`,
                    },
                    {
                        name: "ID",
                        value: `\`${user.id}\``,
                    },
                    {
                        name: "Avatar's Hash",
                        value: `${user.avatar ? user.avatar : `None.`}`,
                    },
                    {
                        name: "Banner's Hash",
                        value: `${user.banner ? user.banner : `None.`}`,
                    },
                ])
                .setAuthor({
                    name: author(username),
                    iconURL: user.displayAvatarURL({
                        size: 1024,
                        extension: "png",
                        forceStatic: true,
                    }),
                })
                .setFooter({
                    text: footer(user__.username),
                    iconURL: user__.displayAvatarURL({
                        size: 1024,
                        extension: "png",
                        forceStatic: true,
                    }),
                })
                .setThumbnail(
                    user.displayAvatarURL({
                        size: 1024,
                        extension: "png",
                        forceStatic: true,
                    })
                )
                .setImage(
                    user.bannerURL({
                        size: 1024,
                        extension: "png",
                        forceStatic: true,
                    })
                );

            const initialMessage = await interaction.reply({
                embeds: [userEmbed],
                components: [row(false)],
                ephemeral: ephemeral_,
            });

            const filter = (i) => i.user.id === interaction.user.id;

            const collector =
                interaction.channel.createMessageComponentCollector({
                    filter,
                    time: duration(2, "minutes").asMilliseconds(),
                    componentType: ComponentType.StringSelect,
                });

            collector.on("collect", async (i) => {
                const id = i.values[0];

                const roleEmbed = new EmbedBuilder()
                    .setTitle(
                        `<:role:808826577785716756> ${user.username}'s Roles`
                    )
                    .setColor(user.hexAccentColor || embeds.colours.transparent)
                    .addFields([
                        {
                            name: `${maxDisplayRoles(sortedRoles)} of ${
                                sortedRoles.length
                            } roles`,
                            value: `${
                                sortedRoles
                                    .slice(0, maxDisplayRoles(sortedRoles))
                                    .join(" ") || `None.`
                            }`,
                        },
                    ])
                    .setAuthor({
                        name: author(username),
                        iconURL: user.displayAvatarURL({
                            size: 1024,
                            extension: "png",
                            forceStatic: true,
                        }),
                    })
                    .setFooter({
                        text: footer(user__.username),
                        iconURL: user__.displayAvatarURL({
                            size: 1024,
                            extension: "png",
                            forceStatic: true,
                        }),
                    });

                const memberEmbed = new EmbedBuilder()
                    .setTitle(
                        `<:members:658538493470965787> ${user.username}'s Server Information`
                    )
                    .setColor(user.hexAccentColor || embeds.colours.transparent)
                    .addFields([
                        {
                            name: "Hex Accent Colour",
                            value: member.displayHexColor
                                ? `\`${member.displayHexColor}\``
                                : `None.`,
                            inline: true,
                        },
                        {
                            name: "Nickname",
                            value: member.nickname
                                ? `${member.nickname}`
                                : `${member.displayName}`,
                            inline: true,
                        },
                        {
                            name: "Joined At",
                            value: `<t:${parseInt(
                                member.joinedTimestamp / 1000
                            )}:F>`,
                        },
                        {
                            name: "Activities",
                            value:
                                member.presence?.activities
                                    .map(
                                        (activity) =>
                                            `- ${activityType[activity.type]} ${
                                                activity.name
                                            }`
                                    )
                                    .join("\n") || `None.`,
                        },
                        {
                            name: "Boosting Server",
                            value: member.roles.premiumSubscriberRole
                                ? `<t:${parseInt(
                                      member.premiumSinceTimestamp / 1000
                                  )}:F>`
                                : `No.`,
                        },
                        {
                            name: "Avatar's Hash",
                            value: `${member.avatar ? member.avatar : `None.`}`,
                        },
                    ])
                    .setAuthor({
                        name: author(username),
                        iconURL: user.displayAvatarURL({
                            size: 1024,
                            extension: "png",
                            forceStatic: true,
                        }),
                    })
                    .setFooter({
                        text: footer(user__.username),
                        iconURL: user__.displayAvatarURL({
                            size: 1024,
                            extension: "png",
                            forceStatic: true,
                        }),
                    })
                    .setThumbnail(
                        member.displayAvatarURL({
                            size: 1024,
                            extension: "png",
                            forceStatic: true,
                        })
                    );

                if (id === "userinfo-roles") {
                    i.update({
                        embeds: [roleEmbed],
                    });
                } else if (id === "userinfo-user") {
                    i.update({
                        embeds: [userEmbed],
                    });
                } else if (id === "userinfo-member") {
                    i.update({
                        embeds: [memberEmbed],
                    });
                }
            });

            collector.on("end", () => {
                initialMessage.edit({
                    components: [row(true)],
                });
            });
        } else if (user == null) {
            return interaction.reply({
                content: `User not found.`,
                ephemeral: true,
            });
        }
    },
};
