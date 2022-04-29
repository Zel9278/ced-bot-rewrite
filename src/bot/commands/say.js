const say = {
    data: {
        name: "say",
        description:
            "If you type text after the command, that text will be returned.",
        options: [
            {
                name: "text",
                description: "The text to be returned.",
                type: "STRING",
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
