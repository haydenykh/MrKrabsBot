const client = require("../index.js");

/**
 * @param {string | undefined} username
 * @returns {string}
 */
function footer(username /*discriminator*/) {
    return client.config.embeds.footer.text.replaceAll("{USERNAME}", username);
}

/**
 * @param {string | undefined} username
 * @returns {string}
 */
function author(username) {
    return client.config.embeds.author.text.replaceAll("{USERNAME}", username);
}

module.exports = {
    footer,
    author,
};
