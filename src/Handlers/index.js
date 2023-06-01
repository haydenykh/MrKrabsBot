const { loadEvents } = require("./LoadEvents.js");
const { loadCommands } = require("./LoadCommands.js");
const { loadButtons } = require("./LoadButtons.js");
const { loadStringSelects } = require("./LoadSelectMenus.js");
const { loadContextMenus } = require("./LoadContextMenus.js");

module.exports = {
    loadEvents,
    loadCommands,
    loadButtons,
    loadStringSelects,
    loadContextMenus,
};
