const { client } = require("../../../")

const ping = {
    data: {
        name: "ping",
        description: "Returns the response speed of Bot.",
    },
    async exec(interaction) {
        await interaction.reply(`PingStep 1/2`)
        await interaction.editReply(`PingStep 2/2`)

        const msg = await interaction.fetchReply()
        await interaction.editReply(
            `API: ${Math.round(client.ws.ping)}ms\nEdit: ${
                msg.editedTimestamp - msg.createdTimestamp
            }ms\nDelay: ${
                msg.createdTimestamp - interaction.createdTimestamp
            }ms`
        )
    },
}

module.exports = ping
