const express = require("express")
const socketIO = require("socket.io")
const http = require("http")
const fs = require("fs")
const path = require("path")
const os = require("os")
const { execSync } = require("child_process")
const discordJS = require("discord.js")

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
        c.emit("commands", client.rawCommands)
        c.emit("hi", {
            versions: {
                discordjs: discordJS.version,
                nodejs: process.version.replace(/v/, ""),
                bot: [
                    config.global.version,
                    config.global.type,
                    config.global.date,
                ],
                os: [
                    `${execSync("cat /etc/issue")
                        .toString()
                        .replace(/\\n|\\l|\\r|\(|\)/g, "")}`,
                    `(${os.platform()} ${os.arch()} ${os.release()})`,
                ],
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
