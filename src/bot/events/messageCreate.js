const { client } = require("../../..")
const { byteToData } = require("../..//utils")
const { MessageType } = require("discord-api-types/v10")

const messageCreate = {
    name: "messageCreate",
    async exec(message) {
        if (message.author.bot) return
        if (![MessageType.Default, MessageType.Reply].includes(message.type))
            return

        if (message.content.match(/https:\/\/discord.com\/channels\//)) {
            const base = message.content
                .split("/")
                .filter((i) => parseInt(i, 10))
            const channel = client.channels.cache.get(base[1])
            const fetchMessage = channel?.messages.fetch(base[2])

            fetchMessage?.then((msg) => {
                message.reply({
                    allowedMentions: {
                        repliedUser: false,
                    },
                    embeds: [
                        [
                            {
                                title: `Message Link`,
                                url: msg.url,
                                description: msg.content,
                                author: {
                                    name: msg.author.tag,
                                    iconURL: msg.author.avatarURL(),
                                },
                                footer: {
                                    text: `Message From ${msg.guild.name}/${msg.channel.name}`,
                                },
                                timestamp: new Date(),
                            },
                        ],
                        msg.attachments.map((a) => {
                            return {
                                title: `Attachment`,
                                url: a.url,
                                description: `${a.name} (${byteToData(
                                    a.size
                                )})`,
                                image: {
                                    url: a.url.match(/.png|.jpg|.jpeg/)
                                        ? a?.url
                                        : "",
                                },
                            }
                        }),
                    ].flat(),
                })
            })
        }
    },
}

module.exports = messageCreate
