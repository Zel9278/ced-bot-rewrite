const fs = require("fs")
const path = require("path")
const { errorToFile } = require("../../utils")

const commandLoader = (client) => {
    global.cmdFiles = fs
        .readdirSync("./src/bot/commands")
        .filter((file) => !file.startsWith("_"))
        .filter((file) => file.endsWith(".js"))

    const ignore = ["index.js"]

    let commands = {
        global: [],
        guild: [],
    }
    let loaded = []

    async function init() {
        const { infoLoop } = require("../../../")

        fs.readdirSync(__dirname)
            .filter((file) => !file.startsWith("_"))
            .filter((file) => file.endsWith(".js"))
            .filter((a) => !ignore.includes(a))
            .forEach((file) => {
                try {
                    const command = require(`./${file}`)
                    command._path = path.join(__dirname, file)

                    if (command.isGuildCommand) {
                        commands.guild.push(command)
                        if (client.config.debug)
                            console.log(
                                `Added guild command: ${command.data.name}`
                            )
                    } else {
                        commands.global.push(command)
                        if (client.config.debug)
                            console.log(
                                `Added global command: ${command.data.name}`
                            )
                    }
                } catch (error) {
                    errorToFile("command loader", error)
                    console.log(file, error.toString())
                }
            })

        await client.application.commands
            .set(commands.global.map((c) => c.data))
            .then(() => {
                if (client.config.debug) console.log(`Loaded global commands.`)
            })

        await client.config.guilds.forEach(async (g) => {
            const guild = client.guilds.resolve(g)
            if (!guild) return

            await guild.commands
                .set(commands.guild.map((c) => c.data))
                .then(() => {
                    if (client.config.debug)
                        console.log(`Loaded ${guild.name}'s commands.`)
                })
        })

        loaded.push(...Object.values(commands).flat())
        Object.assign(loaded, { init, _rawCommands: commands })
        await infoLoop.emit("commandInitialize", loaded)
    }

    Object.assign(loaded, { init, _rawCommands: commands })

    return loaded
}

module.exports = commandLoader
