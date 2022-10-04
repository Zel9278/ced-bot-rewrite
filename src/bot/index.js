const { Client, PresenceUpdateStatus } = require("discord.js")
const commandLoader = require("./commands")
const eventLoader = require("./events")

function bot(config) {
    const client = new Client(config.option)
    const customCommands = commandLoader(client)
    const customEvents = eventLoader(client)

    Object.assign(client, {
        config,
        customCommands,
        customEvents,
        _rawCommands: customCommands._rawCommands,
        _rawEvents: customEvents._rawEvents,
    })

    client.once("ready", async () => {
        console.log("bot is ready")
        client.user.presence.set({
            status: "dnd",
            activities: [
                {
                    name: "Depelopment by ced",
                    type: PresenceUpdateStatus.Playing,
                },
            ],
        })
        customCommands.init()
        customEvents.init()
    })

    client.login(process.env.DISCORD_TOKEN)
    return client
}

module.exports = bot
