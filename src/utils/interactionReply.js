async function interactionReply(interaction, data) {
    if (interaction.replied) {
        interaction.editReply(data);
    } else if (interaction.deferred) {
        return interaction.channel.send(data);
    } else {
        interaction.reply(data);
    }
}

module.exports = interactionReply;
