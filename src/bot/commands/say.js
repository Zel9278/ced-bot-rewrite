const { ApplicationCommandOptionType } = require("discord-api-types/v10")

const say = {
    data: {
        name: "say",
        description:
            "If you type text after the command, that text will be returned.",
        options: [
            {
                name: "text",
                description: "The text to be returned.",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    async exec(interaction) {
        await interaction.reply({
            embeds: [
                {
                    description: interaction.options.getString("text"),
                },
            ],
        })
    },
}

module.exports = say
