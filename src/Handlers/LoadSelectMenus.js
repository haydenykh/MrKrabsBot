const { ExtendedClient } = require("../Base/index.js");
const fs = require("node:fs");
const Table = require("cli-table3");
const colors = require("@colors/colors");
const chalk = require("chalk");

/**
 * @param {ExtendedClient} client
 */
async function loadStringSelects(client) {
    const table = new Table({
        head: [" StringSelects ", " Status "],
        colAligns: ["center", "center"],
        rowAligns: ["center", "center"],
        style: {
            head: ["cyan", "bold"],
        },
    });

    /* by lyxcode */
    /* end */

    const stringSelectFolders = fs.readdirSync(
        "./src/Components/StringSelects"
    );
    for (const stringSelectFolder of stringSelectFolders) {
        const stringSelectFiles = fs
            .readdirSync(`./src/Components/StringSelects/${stringSelectFolder}`)
            .filter((file) => file.endsWith(".js"));
        for (const stringSelectFile of stringSelectFiles) {
            const stringSelect = require(`../Components/StringSelects/${stringSelectFolder}/${stringSelectFile}`);
            if (!stringSelect.id) return;

            client.stringSelects.set(stringSelect.id, stringSelect);

            table.push([stringSelect.id, colors.green("Success")]);
        }
    }

    return console.log(
        table.toString() +
            `\n${chalk.green(`[stringSelects] Loaded StringSelects.`)}`
    );
}

module.exports = {
    loadStringSelects,
};
