const fs = require("fs");
const path = require("path");
const { errorToFile } = require("../../utils");

const commandLoader = (client) => {
    const ignore = ["index.js"];

    let commands = {
        global: [],
        guild: []
    };
    let loaded = [];

    async function init() {
        const { infoLoop } = require("../../../");

        fs.readdirSync(__dirname).filter(a=>!ignore.includes(a)).forEach(file => {
            try {
                if (!file.endsWith(".js")) return;

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
                errorToFile("command loader", error);
                console.log(file, error.toString());
            }
        });

        await client.application.commands.set(commands.global.map(c => c.data)).then(() => {
            if (client.config.debug) console.log(`Loaded global commands.`);
        });

        await client.config.guilds.forEach(async g => {      
            const guild = client.guilds.resolve(g);

            await guild.commands.set(commands.guild.map(c => c.data)).then(() => {
                if (client.config.debug) console.log(`Loaded ${guild.name}'s commands.`);
            });

            await guild.commands.permissions.set({
                fullPermissions: commands.guild.filter(local_command=>local_command.data.permissions).map(local_command => {
                    const discord_command = guild.commands.cache.find(command => local_command.data.name === command.name);
                    return {
                        id: discord_command.id,
                        permissions: local_command.data.permissions || []
                    }
                })
            });
        });

        loaded.push(...Object.values(commands).flat());
        Object.assign(loaded, { init, _rawCommands: commands });
        await infoLoop.emit("commandInitialize", loaded);
    }


    Object.assign(loaded, { init, _rawCommands: commands });

    return loaded;
};

module.exports = commandLoader;
