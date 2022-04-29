const moment = require("moment-timezone")
const fs = require("fs")
const path = require("path")

function errorToFile(name, e) {
    const logPath = path.join(process.cwd(), "logs/error")
    const allFile = path.join(logPath, "all.log")
    const latestFile = path.join(logPath, "latest.log")

    if (!fs.existsSync(logPath)) fs.mkdirSync(logPath, { recursive: true })
    if (!fs.existsSync(allFile)) fs.writeFileSync(allFile, "")

    const now = moment().tz("Asia/Tokyo").format("YYYY-MM-DD_HH-mm")
    const errorLogFile = fs.readFileSync(allFile, "utf-8")
    const errorLog = `${errorLogFile}${now} - [${name}] ${e.message}\n------------------------------\n${e.stack}\n------------------------------\n\n`

    fs.writeFileSync(allFile, errorLog)
    fs.writeFileSync(
        latestFile,
        `${now} - [${name}] ${e.message}\n------------------------------\n${e.stack}\n------------------------------\n\n`
    )
    console.error(`[ERROR - ${now}] ${name} - ${e.message}`)
    console.error(
        `[ERROR - ${now}] An error has occurred, see "${latestFile}" for details.`
    )
}

module.exports = errorToFile
