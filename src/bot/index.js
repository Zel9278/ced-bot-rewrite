const { Client, BaseCommandInteraction } = require("discord.js");
const commandLoader = require("./commands");
const { byteToData } = require("../utils");

function bot(config) {
    const client = new Client(config.option);
    const commands = commandLoader(client);

    Object.assign(client, { config, rawCommands: commands._rawCommands });

    client.once("ready", async () => {
        console.log("bot is ready");
        commands.init();
    });

    client.on("interactionCreate", interaction => {
        if (interaction instanceof BaseCommandInteraction) {
            const command = commands.find(x => x.data.name == interaction.commandName);
            command?.exec?.(interaction);
        }
    });

    client.on("messageCreate", async message => {
        if (message.author.bot) return;
        if (!["DEFAULT", "REPLY"].some(ct => ct === message.type)) return;
        
        if(message.content.match(/https:\/\/discord.com\/channels\//)) {
            const base = message.content.split("/").filter(i => parseInt(i, 10));
            const channel = client.channels.cache.get(base[1]);
            const fetchMessage = channel?.messages.fetch(base[2]);

            fetchMessage?.then(msg => {
                message.reply({
                    allowedMentions: {
                        repliedUser: false
                    },
                    embeds: [
                        [
                            {
                                title: `Message Link`,
                                url: msg.url,
                                description: msg.content,
                                author: {
                                    name: msg.author.tag,
                                    iconURL: msg.author.avatarURL()
                                },
                                footer: {
                                    text: `Message From ${msg.guild.name}/${msg.channel.name}`
                                },
                                timestamp: new Date()
                            }
                        ],
                        msg.attachments.map(a => {
                            return {
                                title: `Attachment`,
                                url: a.url,
                                description: `${a.name} (${byteToData(a.size)})`,
                                image: {
                                    url: (a.url.match(/.png|.jpg|.jpeg/))?a?.url:""
                                }
                            }
                        })
                    ].flat()
                });
            });
        }
    });

    client.login(process.env.DISCORD_TOKEN);
    return client;
}

module.exports = bot;