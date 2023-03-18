const client = require("../index.js");

/**
 * @param {string | undefined} username
 * @param {string | undefined} discriminator
 * @returns {string}
 */
function footer(username, discriminator) {
    return client.config.embeds.footer.text
        .replaceAll("{USERNAME}", username)
        .replaceAll("{DISCRIMINATOR}", discriminator);
}

function author(username, discriminator) {
    return client.config.embeds.author.text
        .replaceAll("{USERNAME}", username)
        .replaceAll("{DISCRIMINATOR}", discriminator);
}

module.exports = {
    footer,
    author,
};
