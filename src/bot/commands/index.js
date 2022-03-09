const fs = require("fs");
const path = require("path");

const commandLoader = (client) => {
    const ignore = ["index.js"];

    let commands = {
        global: [],
        guild: []
    };
    let loaded = [];

    async function init(reinit = false) {
        const { infoLoop } = require("../../../");

        fs.readdirSync(__dirname).filter(a=>!ignore.includes(a)&&a.endsWith(".js")).forEach(file => {
            try {
                const command = require(`./${file}`);
                command._path = path.join(__dirname, file);
                if (command.isGuildCommand) {
                    commands.guild.push(command);
                    if (client.config.debug) console.log(`Added guild command: ${command.data.name}`);
                } else {
                    commands.global.push(command);
                    if (client.config.debug) console.log(`Added global command: ${command.data.name}`);
                }
            } catch (error) {
                console.log(file, error.toString());
            }
        });

        await client.application.commands.set(commands.global.map(c => c.data)).then(() => {
            if (client.config.debug) console.log(`Loaded global commands.`);
        });;
        await client.config.guilds.forEach(async g => {      
            const guild = client.guilds.resolve(g);
            await guild.commands.set(commands.guild.map(c => c.data)).then(() => {
                if (client.config.debug) console.log(`Loaded ${guild.name}'s commands.`);
            });
            if (!reinit) await guild.commands.permissions.set({
                fullPermissions: commands.guild.filter(local_command=>local_command.data.permissions).map(local_command => {
                    const discord_command = guild.commands.cache.find(command => local_command.data.name === command.name);
                    return {
                        id: discord_command.id,
                        permissions: local_command.data.permissions || []
                    }
                })
            });
        });

        infoLoop.once("re-initialize", async () => {
            if (client.config.debug) console.log("--- Commands re-initialize Start ---");
            await deInit();
            await init(true);
            infoLoop.emit("re-initialized", loaded);
            if (client.config.debug) console.log("--- End ---");
        });

        loaded.push(...Object.values(commands).flat());
        Object.assign(loaded, { init, deInit, _rawCommands: commands });
        await infoLoop.emit("commandInitialize", loaded);
    }

    async function deInit() {
        await client.application.commands.set([]).then(() => {
            if (client.config.debug) console.log(`Deleted global commands.`);
        });
        await client.config.guilds.forEach(async g => {
            const guild = client.guilds.resolve(g);
            await guild.commands.set([]).then(() => {
                if (client.config.debug) console.log(`Deleted ${guild.name}'s commands.`);
            });
        });
        commands = {
            global: [],
            guild: []
        };
        loaded.forEach(c => {
            delete require.cache[c._path];
        });
        loaded = [];
        Object.assign(loaded, { init, _rawCommands: commands });
        if (client.config.debug) console.log("Commands de-initialized.");
    }

    Object.assign(loaded, { init, deInit, _rawCommands: commands });

    return loaded;
};

module.exports = commandLoader;
