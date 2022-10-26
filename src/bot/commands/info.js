const { client, infoLoop, config } = require("../../../")
const {
    unixToDate,
    byteToData,
    progressBar,
    getMacOSRelease,
    getOSRelease,
} = require("../../utils")
const { ApplicationCommandOptionType } = require("discord.js")
const os = require("os")
const Discord = require("discord.js")
const packages = require("../../../package.json")

const info = {
    data: {
        name: "info",
        description: "Displays the bot information.",
        options: [
            {
                name: "info",
                description: "other info",
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: "Packages",
                        value: "packages"
                    }
                ],
                required: false
            },
        ],
    },
    async exec(interaction) {
        const other = interaction.options.getString("info")

        const isWin = os.platform() === "win32"
        const isMac = os.platform() === "darwin"

        const version = isWin
            ? os.version()
            : isMac
            ? getMacOSRelease().name
            : getOSRelease()?.pretty_name
        const _os = `${version}(${os.type()} ${os.platform()} ${os.arch()} ${os.release()})`
        const model = os.cpus()[0] ? os.cpus()[0].model : "unknown cpu"

        const parsmema = Math.floor((1 - os.freemem() / os.totalmem()) * 20)
        const parsmemb = Math.floor((1 - os.freemem() / os.totalmem()) * 100)
        const cpuUsage = infoLoop.current.cpu.cpus
        const cpua = Math.floor(
            cpuUsage.map((a) => a.cpu).reduce((a, b) => a + b) / cpuUsage.length
        )
        const cpub = Math.floor((cpua / 100) * 20)
        const diskUsage = infoLoop.current.storage
        const parsdua = Math.floor((1 - diskUsage.free / diskUsage.total) * 20)
        const parsdub = Math.floor((1 - diskUsage.free / diskUsage.total) * 100)
        const codeBlock = "```"

        switch (other) {
            case "packages":
                await interaction.reply(
                    "```\n" +
                        Object.keys(packages.dependencies)
                            .map((e) => {
                                return `${e}: ${packages.dependencies[e]}`
                            })
                            .join("\n") +
                        "\n```"
                )
                break

            default:
                await interaction.reply({
                    embeds: [
                        {
                            title: `Version ${config.global.version} ${config.global.type} ${config.global.date}`,
                            description: config.global.info,
                            url: "https://beta-cedbot.csys64.com/",
                            color: 2522551,
                            fields: [
                                {
                                    name: "Versions",
                                    value: `Node: ${process.version}\nDiscord: ${Discord.version}`,
                                },
                                {
                                    name: "OS",
                                    value: `${_os}\n${
                                        os.userInfo().username
                                    }@${os.hostname()}`,
                                },
                                {
                                    name: "OSCPU",
                                    value: `${model}\n${codeBlock}\n[${progressBar(
                                        cpub,
                                        20
                                    )}] ${cpua}%\n${codeBlock}`,
                                },
                                {
                                    name: "OSMemory",
                                    value: `${byteToData(
                                        os.totalmem() - os.freemem()
                                    )} / ${byteToData(
                                        os.totalmem()
                                    )}\n${codeBlock}\n[${progressBar(
                                        parsmema,
                                        20
                                    )}] ${parsmemb}%\n${codeBlock}`,
                                },
                                {
                                    name: "OSStorage",
                                    value: `${byteToData(
                                        diskUsage.total - diskUsage.free
                                    )} / ${byteToData(
                                        diskUsage.total
                                    )}\n${codeBlock}\n[${progressBar(
                                        parsdua,
                                        20
                                    )}] ${parsdub}%\n${codeBlock}`,
                                },
                                {
                                    name: "OSUptime",
                                    value: unixToDate(os.uptime() * 1000),
                                },
                                {
                                    name: "BotUptime",
                                    value: unixToDate(client.uptime),
                                },
                            ],
                            timestamp: new Date(),
                        },
                    ],
                })
                break
        }
    },
}

module.exports = info
