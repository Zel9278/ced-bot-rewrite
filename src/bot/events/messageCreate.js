const { client } = require("../../..")
const { byteToData } = require("../..//utils")
const { MessageType } = require("discord.js")

const messageCreate = {
    name: "messageCreate",
    async exec(message) {
        if (message.author.bot) return
        if (![MessageType.Default, MessageType.Reply].includes(message.type))
            return

        if (
            message.content.match(
                /https:\/\/?(canary|ptb)?.discord.com\/channels\/[0-9]+\/[0-9]+\/[0-9]+/g
            )
        ) {
            const msgs = message.content.match(
                /https:\/\/?(canary|ptb)?.discord.com\/channels\/[0-9]+\/[0-9]+\/[0-9]+/g
            )
            let fetchedMessages = []
            for (const url of msgs) {
                const base = url.split("/").filter((i) => parseInt(i, 10))
                const channel = client.channels.resolve(base[1])
                const fetchMessage = await channel?.messages.fetch(base[2])
                if (channel && fetchMessage) {
                    const msg = {
                        title:
                            `Message Link` +
                            ((fetchMessage.embeds.length > 0
                                ? " (with embeds)"
                                : "") ||
                                (fetchMessage.attachments.size > 0
                                    ? " (with attachments)"
                                    : "")),
                        url: fetchMessage.url,
                        description: fetchMessage.content,
                        author: {
                            name: fetchMessage.author.tag,
                            iconURL: fetchMessage.author.avatarURL(),
                        },
                        footer: {
                            text: `Message From ${fetchMessage.guild.name}/${fetchMessage.channel.name}`,
                        },
                    }

                    fetchedMessages.push(msg)
                }
            }

            message.reply({
                allowedMentions: {
                    repliedUser: false,
                },
                embeds: fetchedMessages,
            })
        }
    },
}

module.exports = messageCreate
