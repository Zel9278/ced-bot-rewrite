require("dotenv").config();

const bot = require("./src/bot");
const info = require("./src/info.js");
const web = require("./src/web");

const config = require("./configs");
config.global.date = (require("moment-timezone"))().format("YYYY/MM/DD HH:mm");

const client = bot(config.bot);
const infoLoop = info(client);
web(client, infoLoop, config);

module.exports = {
    client,
    infoLoop,
    config
};
