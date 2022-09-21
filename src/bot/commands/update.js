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

        const fetch = execSync("git fetch").toString()
        if (!fetch) await interaction.reply("fetch not found")
        if (fetch) await interaction.reply("```bash\n" + fetch + "\n```")
        const msg = await interaction.fetchReply()
        const diff = execSync("git diff HEAD..master/master").toString()
        if (!diff) return await msg.reply("diff not found")
        await msg.reply("```diff\n" + diff + "\n```")
        if (diff.match(/package.json/)) {
            const pnpm = execSync("pnpm i").toString()
            await msg.reply("```bash\n" + pnpm + "\n```")
        }
        const pull = execSync("git pull").toString()
        if (!pull) return await msg.reply("pull not found")
        await msg.reply("```bash\n" + pull + "\n```")
        await msg.reply("Restarting...")
        execSync("pm2 restart cedbot-re")
    },
    isGuildCommand: true,
}

module.exports = update
