const { ExtendedClient } = require("../Base/index.js");
const fs = require("node:fs");
const Table = require("cli-table3");
const colors = require("@colors/colors");
const chalk = require("chalk");

/**
 * @param {ExtendedClient} client
 */
async function loadButtons(client) {
    const table = new Table({
        head: [" Buttons ", " Status "],
        colAligns: ["center", "center"],
        rowAligns: ["center", "center"],
        style: {
            head: ["cyan", "bold"],
        },
    });

    /* by lyxcode */
    /* end */

    const buttonFolders = fs.readdirSync("./src/Components/Buttons");
    for (const buttonFolder of buttonFolders) {
        const buttonFiles = fs
            .readdirSync(`./src/Components/Buttons/${buttonFolder}`)
            .filter((file) => file.endsWith(".js"));
        for (const buttonFile of buttonFiles) {
            const button = require(`../Components/Buttons/${buttonFolder}/${buttonFile}`);
            if (!button.id) return;

            client.buttons.set(button.id, button);

            table.push([button.id, colors.green("Success")]);
        }
    }

    return console.log(
        table.toString() + `\n${chalk.green(`[buttons] Loaded buttons.`)}`
    );
}

module.exports = {
    loadButtons,
};
