const { client } = require("../../../")
const puppeteer = require("puppeteer")

const webshot = {
    data: {
        name: "webshot",
        description: "Take a screenshot of a website.",
        options: [
            {
                name: "url",
                description: "Type the url you want to screenshot.",
                type: "STRING",
                required: true,
            },
            {
                name: "width",
                description: "Type the width of the screenshot.",
                type: "NUMBER",
            },
            {
                name: "height",
                description: "Type the height of the screenshot.",
                type: "NUMBER",
            },
            {
                name: "fullpage",
                description: "Take a full page screenshot.",
                type: "BOOLEAN",
            },
            {
                name: "delay",
                description: "Type the delay in milliseconds.",
                type: "NUMBER",
            },
        ],
    },
    async exec(interaction) {
        if (!client.config.admins.includes(interaction.user.id)) {
            return interaction.reply(
                "You have no permission to use this command."
            )
        }

        const url = interaction.options.getString("url")
        const width = interaction.options.getNumber("width") || 1280
        const height = interaction.options.getNumber("height") || 720
        const fullPage = interaction.options.getBoolean("fullpage") || false
        const delay = interaction.options.getNumber("delay") || 0

        await interaction.reply("[Startup]Please Wait...")

        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            ignoreDefaultArgs: ["--mute-audio", "--hide-scrollbars"],
            headless: true,
        })

        await interaction.editReply("[1/5]launch OK")
        const page = await browser.newPage()

        await page.setViewport({ width, height })
        await page.deleteCookie()
        await page.setCookie(
            ...[
                {
                    name: "nagAccepted",
                    value: "true",
                    domain: "ourworldofpixels.com",
                },
            ]
        )

        await interaction.editReply("[2/5]Access Now...")
        await page.goto(url).catch(async (e) => {
            browser.close()
            throw e
        })

        await interaction.editReply("[3/5]Wait for page...")

        setTimeout(async () => {
            const bufferimage = await page.screenshot({
                fullPage,
                encoding: "binary",
            })
            await interaction.editReply("[4/5]Screenshot OK")

            await browser.close()
            await interaction.editReply("[5/5]Complete!")

            await interaction.editReply({
                files: [{ attachment: bufferimage, name: "web.png" }],
                embeds: [
                    {
                        title: "web.png",
                        image: { url: "attachment://web.png" },
                    },
                ],
            })
        }, delay)
    },
    isGuildCommand: true,
}

module.exports = webshot
