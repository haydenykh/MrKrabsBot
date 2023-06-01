const { ExtendedClient } = require("../Base/index.js");
const fs = require("node:fs");
const Table = require("cli-table3");
const colors = require("@colors/colors");
const chalk = require("chalk");

/**
 * @param {ExtendedClient} client
 */
async function loadContextMenus(client) {
    const table = new Table({
        head: [" Buttons ", " Status "],
        colAligns: ["center", "center"],
        rowAligns: ["center", "center"],
        style: {
            head: ["cyan", "bold"],
        },
    });

    const userContextMenuFolders = fs.readdirSync(
        "./src/Components/UserContextMenu"
    );
    for (const userContextMenuFolder of userContextMenuFolders) {
        const userContextMenuFiles = fs
            .readdirSync(
                `./src/Components/UserContextMenus/${userContextMenuFolder}`
            )
            .filter((file) => file.endsWith(".js"));
        for (const userContextMenuFile of userContextMenuFiles) {
            const userContextMenu = require(`../Components/UserContextMenuS/${userContextMenuFolder}/${userContextMenuFile}`);
            if (!userContextMenu.id) return;

            client.userContextMenus.set(userContextMenu.id, userContextMenu);

            table.push([userContextMenu.id, colors.green("Success")]);
        }
    }

    return console.log(
        table.toString() +
            `\n${chalk.green(`[userContextMenus] Loaded User Context Menus.`)}`
    );
}

module.exports = {
    loadContextMenus,
};
