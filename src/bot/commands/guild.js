const moment = require("moment-timezone");
const { client } = require("../../../");

const guild = {
    data: {
        name: "guild",
        description: "Displays this guild information."
    },
    async exec(interaction) {
        const guild = client.guilds.resolve(interaction.guild.id) || interaction.guild;

        if (!guild) return interaction.reply("guild is not found.");

        const createdAt = moment(guild.createdAt)
            .tz("Asia/Tokyo")
            .format("YYYY/MM/DD-HH:mm");
        const botCount = checkBots(guild);
        const memberCount = checkMembers(guild);
        const banner = (guild.banner) ? guild.bannerURL({dynamic: true}) : null;

        await interaction.reply({
            embeds: [
                {
                    color: Math.floor(Math.random() * 16777214) + 1,
                    thumbnail: {
                        url: guild.iconURL({dynamic: true})
                    },
                    image: {
                        url: banner,
                    },
                    title: "Server",
                    timestamp: new Date(),
                    fields: [
                        {
                            name: "Name",
                            value: guild.name,
                            inline: true
                        },
                        {
                            name: "ID",
                            value: guild.id,
                            inline: true
                        },
                        {
                            name: "ChannelCounts",
                            value:
                            "All: " +
                            guild.channels.cache.size +
                            "\nCategory: " +
                            guild.channels.cache.filter(m => m.type == "GUILD_CATEGORY").size +
                            "\nText: " +
                            guild.channels.cache.filter(m => m.type == "GUILD_TEXT").size +
                            "\nVoice: " +
                            guild.channels.cache.filter(m => m.type == "GUILD_VOICE").size,
                            inline: true
                        },
                        {
                            name: "UserCounts",
                            value:
                            "All: " +
                            guild.members.cache.size +
                            "\nMember: " + memberCount +
                            "\nBot: " + botCount +
                            "\n----------------" +
                            "\nOnline: " +
                            guild.members.cache.filter(m => m.presence?.status == "online").size +
                            "\nIdle: " +
                            guild.members.cache.filter(m => m.presence?.status == "idle").size +
                            "\ndnd: " +
                            guild.members.cache.filter(m => m.presence?.status == "dnd").size +
                            "\nOffline: " +
                            guild.members.cache.filter(m => m.presence?.status == "offline").size +
                            "\nWhat: " +
                            guild.members.cache.filter(m => !m.presence?.status).size,
                            inline: true
                        },
                        {
                            name: "Objects",
                            value:
                            "Role: " +
                            guild.roles.cache.size +
                            "\nEmoji: " +
                            guild.emojis.cache.size +
                            "\nSticker: " +
                            guild.stickers.cache.size,
                            inline: true
                        },
                        {
                            name: "Boost",
                            value: `Count: ${(guild.premiumSubscriptionCount)?guild.premiumSubscriptionCount:0}\nLevel: ${guild.premiumTier}`,
                            inline: true
                        },
                        {
                            name: "Created",
                            value: createdAt,
                            inline: true
                        }
                    ]
                }
            ]
        });
    }
};

module.exports = guild;


function checkBots(guild) {
    let botCount = 0;

    guild.members.cache.forEach(member => {
        if (member.user.bot) botCount++;
    });

    return botCount;
}

function checkMembers(guild) {
    let memberCount = 0;

    guild.members.cache.forEach(member => {
        if (!member.user.bot) memberCount++;
    });

    return memberCount;
}