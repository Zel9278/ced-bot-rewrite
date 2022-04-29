const { EventEmitter } = require("events")
const os = require("os")
const diskUsage = require("diskusage")
const cpuStats = require("cpu-stats")
const { unixToDate } = require("./utils")

function info(client) {
    const data = new EventEmitter()
    data.on("data", (usage) => (data.current = usage))

    setInterval(() => {
        cpuStats(1000, (error, result) => {
            const du = diskUsage.checkSync("/")
            data.emit("data", {
                cpu: {
                    model: os.cpus()[0].model,
                    cpus: result,
                    percent: Math.floor(
                        result.map((a) => a.cpu).reduce((a, b) => a + b) /
                            result.length
                    ),
                },
                ram: {
                    free: os.freemem(),
                    total: os.totalmem(),
                    percent: Math.floor(
                        (1 - os.freemem() / os.totalmem()) * 100
                    ),
                },
                storage: {
                    free: du.free,
                    total: du.total,
                    percent: Math.floor((1 - du.free / du.total) * 100),
                },
                uptime: {
                    os: unixToDate(os.uptime() * 1000),
                    bot: unixToDate(client.uptime),
                },
                servers: client.guilds.cache.size,
                users: client.users.cache.size,
                presence: {
                    status: client.user.presence.status,
                    activities: client.user.presence.activities,
                },
            })
        })
    }, 1000)

    return data
}

module.exports = info
