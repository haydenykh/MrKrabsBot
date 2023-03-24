/*
 * SUCCESS
 */
const successEmbed = new EmbedBuilder()
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
    });

/*
% WARNING
*/
const warningEmbed = new EmbedBuilder()
    .setTitle(
        `${client.config.emojis.warning} ${client.config.messages.action.warning}`
    )
    .setDescription()
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
    .setColor(client.config.embeds.colours.warning)
    .setTimestamp();

/*
! ERROR
*/
const errorEmbed = new EmbedBuilder()
    .setTitle(
        `${client.config.emojis.x_mark} ${client.config.messages.action.failed}`
    )
    .setDescription()
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
        text: footer(client.user.username, client.user.discriminator),
        iconURL: client.user.displayAvatarURL({
            size: 2048,
            forceStatic: true,
            extension: "png",
        }),
    });
