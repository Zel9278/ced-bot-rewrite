const { client, infoLoop } = require("../../..")
const { toSafeString, interactionReply, errorToFile } = require("../../utils")
const { codeFrameColumns } = require("@babel/code-frame")
const { inspect } = require("util")
const fs = require("fs")
const { ApplicationCommandOptionType } = require("discord-api-types/v10")
const axios = require("axios")

const parseEnv = (env_string) =>
    Object.fromEntries(
        env_string
            .split(/\r\n|\r|\n/g)
            .filter((l) => l.match(/[^ =]+=[^ =]+/))
            .map((l) => l.split("="))
    )
const env = parseEnv(fs.readFileSync(".env", "utf8"))

const js = {
    data: {
        name: "js",
        description: "Execute javascript code.",
        options: [
            {
                name: "code",
                description: "Type the code you want to execute.",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "file",
                description: "Type the file you want to execute.",
                type: ApplicationCommandOptionType.Attachment,
                required: false,
            },
        ],
    },
    async exec(interaction) {
        if (!client.config.admins.includes(interaction.user.id)) {
            return interaction.reply(
                "You have no permission to use this command."
            )
        }

        const file = interaction.options.getAttachment("file")
        if (file && !file.name.endsWith(".js"))
            return interaction.reply("Invalid file, must be .js.")
        const fileCode = file
            ? await axios.get(file.url, { responseType: "arraybuffer" })
            : ""

        const code =
            interaction.options.getString("code") ||
            fileCode?.data?.toString("utf8")

        let timer = process.hrtime()
        try {
            let evalData = await eval(code.toString("utf-8"))
            let evaled = toSafeString(env, inspect(evalData, { depth: 1 }))
            timer = process.hrtime(timer)
            const timerData = `*Executed in ${
                timer[0] > 0 ? `${timer[0]}s ` : ""
            }${timer[1] / 1000000}ms.*`
            if (!(evaled.length <= 2000))
                return interactionReply(interaction, {
                    content: timerData,
                    files: [
                        {
                            attachment: Buffer.from(evaled),
                            name: "eval-response.txt",
                        },
                    ],
                })
            await interactionReply(interaction, {
                content:
                    timerData +
                    "\n```javascript\n" +
                    (evaled || "what happen") +
                    "\n```",
            })
        } catch (e) {
            errorToFile("js command", e)
            timer = process.hrtime(timer)
            const timerData = `Executed in ${
                timer[0] > 0 ? `${timer[0]}s ` : ""
            }${timer[1] / 1000000}ms.`
            if (!e.stack.split("\n")[1].match(/:[0-9]+/g)) {
                interactionReply(interaction, {
                    embeds: [
                        {
                            title: "Error",
                            description: toSafeString(env, e.toString()),
                            color: 0xff0000,
                            footer: {
                                text: timerData,
                            },
                        },
                    ],
                })
                return
            }

            const err = e.stack
                .split("\n")[1]
                .match(/:[0-9]+/g)
                .map((v) => parseInt(v.replace(/:/g, ""), 10))
            const codeFrame = codeFrameColumns(code.toString("utf-8"), {
                start: { line: err[2], column: err[3] },
            })
            const isLine =
                err[2] && err[3]
                    ? `${e.toString()}\nline${err[2]} column${err[3]}\n` +
                      "```js\n" +
                      codeFrame +
                      "```"
                    : `${e.toString()}`
            interactionReply(interaction, {
                embeds: [
                    {
                        title: "Error",
                        description: toSafeString(env, isLine),
                        color: 0xff0000,
                        footer: {
                            text: timerData,
                        },
                    },
                ],
            })
        }
    },
    isGuildCommand: true,
}

module.exports = js
