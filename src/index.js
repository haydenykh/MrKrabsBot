const { GatewayIntentBits, Partials } = require("discord.js");
const { ExtendedClient } = require("./Base/index.js");
const chalk = require("chalk");
const { config } = require("dotenv");

config();

const client = new ExtendedClient({
    intents: Object.keys(GatewayIntentBits),
    partials: Object.keys(Partials),
});

module.exports = client;

client.start(process.env.TOKEN);
