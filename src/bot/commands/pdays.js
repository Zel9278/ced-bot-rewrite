const moment = require("moment-timezone")
const { progressBar } = require("../../utils")

const pdays = {
    data: {
        name: "pdays",
        description: "progress days",
    },
    async exec(interaction) {
        const days = parseInt(moment().format("DDDD"))
        const leap = isLeapYear(moment().format("YYYY")) ? 366 : 365

        const dpt = Math.floor((days / leap) * 100)
        const dp = Math.floor((days / leap) * 20)

        interaction.reply(
            `UTC: ${moment().utc().format("llll")}\nJST: ${moment()
                .tz("Asia/Tokyo")
                .format(
                    "llll"
                )}\nNumber of days elapsed: ${days} / ${leap}\n${progressBar(
                dp,
                20
            )} ${dpt}%`
        )
    },
}

module.exports = pdays

function isLeapYear(year) {
    return new Date(year, 2, 0).getDate() === 29
}
