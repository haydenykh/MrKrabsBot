const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    codeBlock,
} = require("discord.js");
const { ExtendedClient } = require("../../Base/index.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("permissions")
        .setDescription("Lists out a user's permission.")
        .addUserOption((option) => {
            return option
                .setName(`user`)
                .setDescription(`The user you want to get their permissions.`)
                .setRequired(false);
        }),
    developerOnly: true,
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction, client) {
        const { options, guild } = interaction;
        const user = options.getUser(`user`) || interaction.user;

        if (user) {
            const member = guild.members.cache.get(user.id);

            const permissions = member.permissions;

            interaction.reply({
                content: `<@!${member.id}>'s Permissions:\n${codeBlock(
                    `- ${permissions.toArray().join("\n- ")}`
                )}`,
                ephemeral: true,
            });
        }
    },
};
