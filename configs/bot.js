const { Intents } = require("discord.js");

const config = {
    option: {
        intents: Object.values(Intents.FLAGS)
    },
    guilds: ["672956423545815040", "898171362621927464", "790149671967391775", "898353871267692565"],
    admin: "923158679006625802",
    debug: true
};

module.exports = config;
