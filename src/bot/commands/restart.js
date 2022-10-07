const { client } = require("../../..")
const { execSync } = require("child_process")

const restart = {
    data: {
        name: "restart",
        description: "Restart the bot",
    },
    async exec(interaction) {
        if (!client.config.admins.includes(interaction.user.id)) {
            return interaction.reply(
                "You have no permission to use this command."
            )
        }

        await interaction.reply("Restarting...")
        execSync("pm2 restart cedbot-re --update-env")
    },
    isGuildCommand: true,
}

module.exports = restart
