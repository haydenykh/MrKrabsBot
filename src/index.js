const { GatewayIntentBits, Partials } = require("discord.js");
const { ExtendedClient } = require("./Base/index.js");
const chalk = require("chalk");
const { config } = require("dotenv");

config();

const client = new ExtendedClient({
    intents: Object.keys(GatewayIntentBits),
    partials: Object.keys(Partials),
});

client.start(process.env.TOKEN);

process.on("unhandledRejection", (reason, _promise) => {
    const reason_ = chalk.red(reason);
    throw reason_;
});
