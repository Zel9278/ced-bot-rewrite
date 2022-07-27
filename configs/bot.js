const { GatewayIntentBits } = require("discord.js")

const config = {
    option: {
        intents: Object.values(GatewayIntentBits).filter(Number.isInteger),
    },
    guilds: [
        "672956423545815040",
        "898171362621927464",
        "790149671967391775",
        "898353871267692565",
        "946172348200001596",
        "990917256290660352",
        "789872357979586572",
    ],
    admins: [
        "923158679006625802",
        "855599077542723604",
        "733108675597828166",
        "615059426369339392",
    ],
    debug: true,
}

module.exports = config
