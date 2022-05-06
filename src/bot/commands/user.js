const moment = require("moment-timezone")
const { unixToDate } = require("../../utils")
const { client } = require("../../../")
const e = require("express")

const user = {
    data: {
        name: "user",
        description: "Displays the user's information.",
        options: [
            {
                name: "user",
                description: "The user to display information about.",
                type: "USER",
            },
        ],
    },
    async exec(interaction) {
        const user = interaction.options.getUser("user") || interaction.user
        const member = client.guilds
            .resolve(interaction.guild.id)
            .members.resolve(user.id)
        const cluser = await client.users.fetch(user.id, { force: true })
        const createdAt = moment(member.user.createdAt)
            .tz("Asia/Tokyo")
            .format("YYYY/MM/DD-HH:mm")
        const joinedAt = moment(member.joinedAt)
            .tz("Asia/Tokyo")
            .format("YYYY/MM/DD-HH:mm")
        const premiumSince = member.premiumSince
            ? moment(member.premiumSince)
                  .tz("Asia/Tokyo")
                  .format("YYYY/MM/DD-HH:mm")
            : "none"
        const avatar = member.user.avatar
            ? member.user.avatarURL({ dynamic: true })
            : member.user.defaultAvatarURL
        const banner = cluser.banner
            ? cluser.bannerURL({ dynamic: true })
            : null
        const presence = member.presence

        await interaction.reply({
            embeds: [
                {
                    color: member.displayHexColor.replace(/#/g, ""),
                    thumbnail: {
                        url: avatar,
                    },
                    image: {
                        url: banner,
                    },
                    title: "User",
                    fields: [
                        {
                            name: "Tag(Nickname)",
                            value:
                                member.user.tag +
                                "(" +
                                member.displayName +
                                ")",
                        },
                        {
                            name: "ID",
                            value: member.id,
                        },
                        {
                            name: "Status",
                            value: presence?.status
                                ? presence.status
                                : "offline",
                        },
                        {
                            name: "Activities",
                            value:
                                presence && presence?.activities.length > 0
                                    ? presence.activities
                                          .map(activities)
                                          .join("\n")
                                    : "Not Playing",
                        },
                        {
                            name: "Created",
                            value: createdAt,
                            inline: true,
                        },
                        {
                            name: "Joined",
                            value: joinedAt,
                            inline: true,
                        },
                        {
                            name: "Boosted",
                            value: premiumSince,
                            inline: true,
                        },
                        {
                            name: "Roles",
                            value: `${
                                member.roles.cache.map((r) => r)[0]
                            } and other ${member.roles.cache.size} roles`,
                        },
                    ],
                },
            ],
        })
    },
}

module.exports = user

function activities(a) {
    var playTime = ""
    var details = ""
    var state = ""
    if (a.type === "CUSTOM_STATUS") {
        a.details = a.state
        a.state = null
    } else {
        a.details
    }

    if (a.details) details = " | " + a.details
    if (a.state) state = " | " + a.state

    if (a.timestamps) {
        if (a.timestamps.start)
            playTime =
                " - " +
                unixToDate(new Date() - a.timestamps.start, {
                    isSymbol: true,
                }) +
                " elapsed"
        if (a.timestamps.end)
            playTime =
                " - " +
                unixToDate(a.timestamps.end - new Date(), { isSymbol: true }) +
                "  left"
    }

    return `[${a.type}${playTime}] ${a.name}${details}${state}`
}
