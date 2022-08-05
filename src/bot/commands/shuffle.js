const { ApplicationCommandOptionType } = require("discord.js")
const { shuffle } = require("../../utils")

const _shuffle = {
    data: {
        name: "shuffle",
        description:
            "If you type text after the command, that text is shuffled.",
        options: [
            {
                name: "text",
                description: "shuffled text",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    async exec(interaction) {
        await interaction.reply({
            embeds: [
                {
                    description: shuffle(
                        interaction.options.getString("text").split("")
                    ).join(""),
                },
            ],
        })
    },
}

module.exports = _shuffle
