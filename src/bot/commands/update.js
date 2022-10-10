const { client } = require("../../..")
const { execSync } = require("child_process")

const update = {
    data: {
        name: "update",
        description: "update the bot",
    },
    async exec(interaction) {
        if (!client.config.admins.includes(interaction.user.id)) {
            return interaction.reply(
                "You have no permission to use this command."
            )
        }

        const HEAD = `HEAD..${execSync("git remote show", {
            windowsHide: true,
        }).toString()}/${execSync("git rev-parse --abbrev-ref HEAD", {
            windowsHide: true,
        }).toString()}`

        let nfmsg = ""

        await interaction.reply("Please wait...")

        const msg = await interaction.fetchReply()

        const fetch = execSync("git fetch", { windowsHide: true }).toString()
        if (fetch) {
            if (fetch.length >= 2000) {
                await msg.reply({
                    files: [
                        {
                            attachment: Buffer.from(fetch),
                            name: "fetch.txt",
                        },
                    ],
                })
            } else {
                await interaction.reply("fetch\n```bash\n" + fetch + "\n```")
            }
        } else {
            nfmsg = "fetch not found"
            await interaction.reply(nfmsg)
        }
        const diff = execSync(`git diff ${HEAD}`, {
            windowsHide: true,
        }).toString()

        if (diff) {
            if (diff.length >= 2000) {
                await msg.reply({
                    files: [
                        {
                            attachment: Buffer.from(diff),
                            name: "fetch.txt",
                        },
                    ],
                })
            } else {
                await msg.reply("diff\n```diff\n" + diff + "\n```")
            }
        } else {
            nfmsg = nfmsg + "\ndiff not found"
            await msg.edit(nfmsg)
        }
        if (diff.match(/package.json/)) {
            const pnpm = execSync("pnpm i", { windowsHide: true }).toString()
            if (pnpm.length >= 2000) {
                await msg.reply({
                    files: [
                        {
                            attachment: Buffer.from(pnpm),
                            name: "pnpm.txt",
                        },
                    ],
                })
            } else {
                await msg.reply("pnpm\n```bash\n" + pnpm + "\n```")
            }
        }

        if (!fetch && !diff) {
            nfmsg = nfmsg + "\nbot is up to date."
            await msg.edit(nfmsg)
            return
        }

        const pull = execSync("git pull", { windowsHide: true }).toString()
        if (!pull) return await msg.reply("pull not found")
        if (pull.length >= 4000) {
            await msg.reply({
                files: [
                    {
                        attachment: Buffer.from(pull),
                        name: "pull.txt",
                    },
                ],
            })
        } else {
            await msg.reply("pull\n```bash\n" + pull + "\n```")
        }
        await msg.reply("```bash\n" + pull + "\n```")

        await msg.reply("Restarting...")
        execSync("pm2 restart cedbot-re --update-env", { windowsHide: true })
    },
    isGuildCommand: true,
}

module.exports = update
