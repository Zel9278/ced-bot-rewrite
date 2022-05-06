const { client } = require("../../..")
const { errorToFile, interactionReply } = require("../../utils")

const interactionCreate = {
    name: "interactionCreate",
    async exec(interaction) {
        if (interaction.isCommand()) {
            try {
                const command = client.customCommands.find(
                    (x) => x.data.name == interaction.commandName
                )
                await command?.exec?.(interaction)
            } catch (error) {
                errorToFile("interactionCreate:command", error)
                interactionReply(interaction, {
                    embeds: [
                        {
                            title: `This is an error in the command "${interaction.commandName}"`,
                            description: error.toString(),
                            color: "ff0000",
                        },
                    ],
                })
            }
        }

        if (interaction.isButton()) {
            try {
                const commandName = interaction.message.interaction.commandName
                const command = client.customCommands.find(
                    (x) => x.data.name == commandName
                )
                const button = command?.events?.find(
                    (x) => x.type == 2 && x.id == interaction.customId
                )
                await button?.exec?.(interaction)
            } catch (error) {
                errorToFile("interactionCreate:button", error)
                interactionReply(interaction, {
                    embeds: [
                        {
                            title: `This is an error in the command ${interaction.commandName} button ${interaction.customId}`,
                            description: error.toString(),
                            color: "ff0000",
                        },
                    ],
                })
            }
        }
    },
}

module.exports = interactionCreate
