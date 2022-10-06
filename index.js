require("dotenv").config()

const { errorToFile } = require("./src/utils")
const bot = require("./src/bot")
const info = require("./src/info.js")
const web = require("./src/web")

const config = require("./configs")
config.global.date = require("moment-timezone")().format("YYYY/MM/DD HH:mm")

global.fs = require("fs")
global.child_process = require("child_process")

const client = bot(config.bot)
const infoLoop = info(client)
web(client, infoLoop, config)

process.on("unhandledRejection", (err) =>
    errorToFile("unhandledRejection", err)
)
process.on("uncaughtException", (err) => errorToFile("uncaughtException", err))

module.exports = {
    client,
    infoLoop,
    config,
}
