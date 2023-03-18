const { ExtendedClient } = require("../Base/index.js");
const Table = require("cli-table3");
const colors = require("@colors/colors");
const fs = require("node:fs");
const chalk = require("chalk");

/* by kajdev */
/**
 * @param {ExtendedClient} client
 */
function loadEvents(client) {
    const table = new Table({
        head: [" Events ", " Status "],
        colAligns: ["center", "center"],
        rowAligns: ["center", "center"],
        style: {
            head: ["cyan", "bold"],
        },
    });

    /* by lyxcode */
    /* end */

    const eventFolders = fs.readdirSync("./src/Events");
    for (const eventFolder of eventFolders) {
        const eventFiles = fs
            .readdirSync(`./src/Events/${eventFolder}`)
            .filter((file) => file.endsWith(".js"));
        for (const eventFile of eventFiles) {
            const event = require(`../Events/${eventFolder}/${eventFile}`);
            client.events.set(event.name, event);
            if (event.rest) {
                if (event.once) {
                    client.rest.once(event.name, (...args) => {
                        event.execute(...args, client);
                    });
                } else {
                    client.rest.on(event.name, (...args) => {
                        event.execute(...args, client);
                    });
                }
            } else {
                if (event.once) {
                    client.once(event.name, (...args) => {
                        event.execute(...args, client);
                    });
                } else {
                    client.on(event.name, (...args) => {
                        event.execute(...args, client);
                    });
                }

                table.push([event.name, colors.green("Success")]);
            }
        }
    }

    return console.log(
        table.toString() + `\n${chalk.green(`[events] Loaded Events.`)}`
    );
}
/* end */

module.exports = { loadEvents };
