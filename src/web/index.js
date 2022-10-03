const express = require("express")
const socketIO = require("socket.io")
const http = require("http")
const path = require("path")
const os = require("os")
const discordJS = require("discord.js")
const { getMacOSRelease, getOSRelease } = require("../utils")

function web(client, infoLoop, config) {
    const app = express()
    const httpServer = http.createServer(app)
    const io = socketIO(httpServer)

    app.use("/src", express.static(path.join(__dirname, "public/src")))
    app.get("/", (req, res) =>
        res.sendFile(path.join(__dirname, "public/index.html"))
    )
    app.use((req, res, next) =>
        res.status(404).sendFile(path.join(__dirname, "404.html"))
    )

    infoLoop.on("data", (data) => io.emit("info", data))
    infoLoop.on("commandInitialize", (data) => io.emit("commands", data))

    io.on("connection", (c) => {
        const isWin = os.platform() === "win32"
        const isMac = os.platform() === "darwin"

        const version = isWin
            ? os.version()
            : isMac
            ? getMacOSRelease().name
            : getOSRelease()?.pretty_name
        const _os = `${os.type()} ${os.platform()} ${os.arch()} ${os.release()}`

        c.emit("commands", client._rawCommands)
        c.emit("hi", {
            versions: {
                discordjs: discordJS.version,
                nodejs: process.version.replace(/v/, ""),
                bot: [
                    config.global.version,
                    config.global.type,
                    config.global.date,
                ],
                os: [`${version}`, `(${_os})`],
            },
            updateInfo: config.global.info,
            madeBy: client.users.resolve("474413012120502304")?.tag,
        })
    })

    httpServer.listen(config.web.port, () => {
        console.log("web server is ready")
    })
}

module.exports = web
