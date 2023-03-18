const { ExtendedClient } = require("../Base/index.js");
const Table = require("cli-table3");
const colors = require("@colors/colors");
const fs = require("node:fs");
const chalk = require("chalk");

/* by kajdev */
/**
 * @param {ExtendedClient} client
 */
function loadCommands(client) {
    const table = new Table({
        head: [" Commands ", " Status "],
        colAligns: ["center", "center"],
        rowAligns: ["center", "center"],
        style: {
            head: ["bold", "cyan"],
        },
    });

    /* by lyxcode */
    client.commands = new Map();
    const commands = new Array();
    /* end */

    const commandFolders = fs.readdirSync("./src/Commands");
    for (const commandFolder of commandFolders) {
        const commandFiles = fs
            .readdirSync(`./src/Commands/${commandFolder}`)
            .filter((file) => file.endsWith(".js"));
        for (const commandFile of commandFiles) {
            const command = require(`../Commands/${commandFolder}/${commandFile}`);
            const properties = { command, commandFolder };
            client.commands.set(command.data.name, properties);

            table.push([file, colors.green("Success")]);
        }
    }

    return console.log(
        table.toString() + `\n${chalk.green(`[commands] Loaded Commands.`)}`
    );
}
/* end */

module.exports = {
    loadCommands,
};
