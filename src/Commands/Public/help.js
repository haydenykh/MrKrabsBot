const {
    SlashCommandBuilder,
    CommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ComponentType,
} = require("discord.js");
const { ExtendedClient } = require("../../Base/index.js");
const {
    capitalizeFirstLetter,
    author,
    footer,
} = require("../../Functions/index.js");
const { duration } = require("moment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("List all the available commands."),
    /**
     * @param {CommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction, client) {
        const emojis = client.config.commands.help.emojis;
        const descriptions = client.config.commands.help.descriptions;

        /**
         * @param {string} name
         * @returns {string[]}
         */
        function getCommand(name) {
            const getCommandID = client.application.commands.cache
                .filter((cmd) => cmd.name === name)
                .map((cmd) => cmd.id);

            return getCommandID;
        }

        const directories = [
            ...new Set(client.commands.map((cmd) => cmd.commandFolder)),
        ];

        const categories = directories.map((dir) => {
            const commands = client.commands
                .filter((cmd) => cmd.commandFolder === dir)
                .map((cmd) => {
                    return {
                        name: cmd.data.name,
                        description:
                            cmd.data.description || `No description provided.`,
                    };
                });

            return {
                directory: capitalizeFirstLetter(dir),
                commands,
            };
        });

        const embed = new EmbedBuilder()
            .setTitle("Command List")
            .setColor(client.config.embeds.colours.transparent)
            .setDescription(
                `Please select a category from the drop down menu below.`
            )
            .setAuthor({
                name: author(
                    interaction.user.username,
                    interaction.user.discriminator
                ),
                iconURL: interaction.user.displayAvatarURL({
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

        /**
         * @param {boolean} state
         */
        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`HELP_MENU`)
                    .setPlaceholder(`Select a category`)
                    .addOptions(
                        categories.map((category) => {
                            return {
                                label: category.directory,
                                description:
                                    descriptions[
                                        category.directory.toLowerCase()
                                    ] ||
                                    `Commands from ${capitalizeFirstLetter(
                                        category.directory
                                    )}. (${category.commands.length})`,
                                value: category.directory.toLowerCase(),
                                emoji:
                                    emojis[category.directory.toLowerCase()] ||
                                    null,
                            };
                        })
                    )
                    .setDisabled(state)
                    .setMinValues(1)
            ),
        ];

        const initialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false),
        });

        const filter = (i) => i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: duration(1, "minute").asMilliseconds(),
            componentType: ComponentType.StringSelect,
        });

        collector.on("collect", async (i) => {
            const [directory] = i.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const emoji = `${emojis[category.directory.toLowerCase()]} `;
            const description = `${
                descriptions[category.directory.toLowerCase()]
            } `;

            const categoryEmbed = new EmbedBuilder()
                .setTitle(
                    `${emoji || null}${capitalizeFirstLetter(
                        directory
                    )} Commands`
                )
                .setDescription(
                    `${
                        description ||
                        `Commands from ${capitalizeFirstLetter(
                            category.directory.toLowerCase()
                        )} (${category.commands.length})`
                    }`
                )
                .setColor(client.config.embeds.colours.transparent)
                .addFields(
                    category.commands.map((cmd) => {
                        return {
                            name: `</${cmd.name}:${getCommand(cmd.name)}>`,
                            value: `\`${cmd.description}\``,
                            inline: true,
                        };
                    })
                )
                .setAuthor({
                    name: author(
                        interaction.user.username,
                        interaction.user.discriminator
                    ),
                    iconURL: interaction.user.displayAvatarURL({
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

            i.update({
                embeds: [categoryEmbed],
            });
        });

        collector.on("end", () => {
            initialMessage.edit({
                components: components(true),
            });
        });
    },
};
