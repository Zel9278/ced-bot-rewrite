const { interactionReply } = require("../../utils")

const nhkw = {
    data: {
        name: "nhkw",
        description: "NHK's weather",
        options: [
            {
                name: "postal_code",
                description: "japan postal code",
                type: "STRING",
                required: true,
            },
        ],
    },
    isGuildCommand: true,
    async exec(interaction) {
        const postalCode = interaction.options.getString("postal_code")
        const url = `http://bml.nhk.jp/radar/${postalCode}/zoom-radar-map.jpg`
        interaction.reply({
            embeds: [
                {
                    title: "image",
                    description: `${url}`,
                    image: {
                        url,
                    },
                },
            ],
        })
    },
}

module.exports = nhkw
