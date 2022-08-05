const { client } = require("../../../")
const { ChannelType, PermissionFlagsBits } = require("discord.js")
const { ChartJSNodeCanvas } = require("chartjs-node-canvas")

const pins = {
    data: {
        name: "pins",
        description: "count the pins of a message.",
    },
    async exec(interaction) {
        await interaction.reply("Waiting for the message to be pinned...")

        const ps = await Promise.all(
            interaction.guild.channels.cache
                .filter(
                    (ch) =>
                        ch.type === ChannelType.GuildText &&
                        ch
                            .permissionsFor(client.user)
                            .has([
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.ReadMessageHistory,
                            ])
                )
                .map(async (ch) => {
                    const pins = await ch.messages.fetchPinned()
                    return { n: ch.name, s: pins.size }
                })
        )

        const configuration = {
            type: "bar",
            data: {
                labels: ps.map((d) => d.n),
                datasets: [
                    {
                        label: "Channel Pins",
                        data: ps.map((d) => d.s),
                    },
                ],
            },
        }

        const chart = new ChartJSNodeCanvas({
            width: 1920,
            height: 1080,
            backgroundColour: "white",
            plugins: {
                requireLegacy: ["chartjs-plugin-datalabels"],
            },
        })

        await interaction.editReply({
            files: [
                {
                    attachment: await chart.renderToBuffer(configuration),
                    name: "chart.png",
                },
            ],
            embeds: [
                {
                    image: {
                        url: "attachment://chart.png",
                    },
                },
            ],
        })
    },
}

module.exports = pins
