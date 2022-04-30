const { interactionReply } = require("../../utils")

const button = {
    data: {
        name: "button",
        description: "this is a test button",
    },
    isGuildCommand: true,
    async exec(interaction) {
        await interaction.reply({
            embeds: [
                {
                    title: "button testing",
                    description: "eoeoeoeoeoeoe",
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
                            label: "Test",
                            style: 1,
                            custom_id: "test",
                        },
                    ],
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Don't click me",
                            style: 4,
                            custom_id: "dont_click_me",
                        },
                    ],
                },
            ],
        })
    },
    events: [
        {
            id: "test",
            type: 2,
            async exec(interaction) {
                interactionReply(interaction, {
                    embeds: [
                        {
                            title: "button testing",
                            description: `${interaction.user.username}#${interaction.user.discriminator} clicked the button`,
                        },
                    ],
                })
            },
        },
        {
            id: "dont_click_me",
            type: 2,
            async exec(interaction) {
                interactionReply(interaction, {
                    embeds: [
                        {
                            title: "why did you click me?",
                            description: `${interaction.user.username}#${interaction.user.discriminator} tried to click the button\nboom:boom:`,
                        },
                    ],
                })
            },
        },
    ],
}

module.exports = button
