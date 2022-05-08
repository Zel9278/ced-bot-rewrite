const { interactionReply } = require("../../utils")

const pagemenu = {
    data: {
        name: "pagemenu",
        description: "this is a test pagemenu",
    },
    isGuildCommand: true,
    async exec(interaction) {
        await interaction.reply({
            embeds: [
                {
                    title: "Page Menu",
                    description: "eo",
                    color: 2522551,
                    timestamp: new Date(),
                },
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            emoji: "⬅️",
                            style: 1,
                            custom_id: "pagemenu:button:left",
                        },
                        {
                            type: 2,
                            emoji: "❌",
                            style: 1,
                            custom_id: "pagemenu:button:delete",
                        },
                        {
                            type: 2,
                            emoji: "➡️",
                            style: 1,
                            custom_id: "pagemenu:button:right",
                        },
                    ],
                },
            ],
        })
    },
}

module.exports = pagemenu

function pageMenu(interaction) {}
