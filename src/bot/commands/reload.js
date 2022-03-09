const { client, infoLoop } = require("../../..");

const reload = {
    data: {
        name: "reload",
        description: "Reload a commands",
        defaultPermission: false,
		permissions: [
			{
				id: client.config.admin,
				type: "USER",
				permission: true
			}
		]
    },
    async exec(interaction) {
        await infoLoop.emit("re-initialize");
        
        await interaction.reply("Reloading...");
        await infoLoop.once("re-initialized", async (loaded) => {
            await interaction.editReply(`reloaded ${loaded.length} commands`);
        });
    },
    isGuildCommand: true
};

module.exports = reload;
