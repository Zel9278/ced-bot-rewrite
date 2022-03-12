const { client, infoLoop, config } = require("../../../");
const { unixToDate, byteToData, progressBar } = require("../../utils");
const os = require("os");

const info = {
    data: {
        name: "info",
        description: "Displays the bot information."
    },
    async exec(interaction) {
        const parsmema = Math.floor((1 - os.freemem() / os.totalmem()) * 20);
        const parsmemb = Math.floor((1 - os.freemem() / os.totalmem()) * 100);
        const cpuUsage = infoLoop.current.cpu.cpus;
        const cpua = Math.floor(cpuUsage.map(a=>a.cpu).reduce((a,b)=>a+b) / cpuUsage.length);
        const cpub = Math.floor(cpua / 100 * 20);
        const diskUsage = infoLoop.current.storage;
        const parsdua = Math.floor((1 - diskUsage.free / diskUsage.total) * 20);
        const parsdub = Math.floor((1 - diskUsage.free / diskUsage.total) * 100);
        const codeBlock = "```";

        await interaction.reply({
            embeds: [
                {
                    title: `Version ${config.global.version} ${config.global.type} ${config.global.date}`,
                    description: config.global.info,
                    url: "https://cedbot.eox2.com/",
                    color: 2522551,
                    fields: [
                    {
                        name: "OS",
                        value: `${os.release()} ${os.platform()} ${os.arch()} ${os.version()}\n${os.userInfo().username}@${os.hostname()}`,
                    },
                    {
                        name: "OSCPU",
                        value: `${os.cpus()[0].model}\n${codeBlock}\n[${progressBar(cpub, 20)}] ${cpua}%\n${codeBlock}`,
                    },
                    {
                        name: "OSMemory",
                        value: `${byteToData(os.totalmem() - os.freemem())} / ${byteToData(os.totalmem())}\n${codeBlock}\n[${progressBar(parsmema, 20)}] ${parsmemb}%\n${codeBlock}`,
                    },
                    {
                        name: "OSStorage",
                        value: `${byteToData(diskUsage.total - diskUsage.free)} / ${byteToData(diskUsage.total)}\n${codeBlock}\n[${progressBar(parsdua, 20)}] ${parsdub}%\n${codeBlock}`,
                    },
                    {
                        name: "OSUptime",
                        value: unixToDate(os.uptime() * 1000),
                    },
                    {
                        name: "BotUptime",
                        value: unixToDate(client.uptime),
                    }
                    ],
                    timestamp: new Date()
                }
            ]
        });
    }
};

module.exports = info;
