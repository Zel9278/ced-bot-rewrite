const { ApplicationCommandOptionType } = require("discord-api-types/v10")

const diceroll = {
    data: {
        name: "diceroll",
        description:
            "If you type text after the command, that text will be returned.",
        options: [
            {
                name: "num1",
                description: "The number of dice to roll.",
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
            {
                name: "num2",
                description: "The number of sides on the dice.",
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
        ],
    },
    async exec(interaction) {
        const t1 = interaction.options.getNumber("num1")
        const t2 = interaction.options.getNumber("num2")
        if (t1 > 20)
            return interaction.reply(
                "The number of 1 in args is limited to 20."
            )
        if (t2 > 500)
            return interaction.reply(
                "The number of 2 in args is limited to 500."
            )
        const base = dr(t1, t2)
        interaction.reply(`(${base.join("+")})=${base.reduce((a, b) => a + b)}`)
    },
}

module.exports = diceroll

function dr(t1, t2) {
    const nums = []
    for (let i = 0; i < t1; i++) {
        nums.push(Math.floor(Math.random() * t2) + 1)
    }
    return nums
}
