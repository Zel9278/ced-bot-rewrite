async function interactionReply(interaction, data) {
    if (interaction.replied) {
        return interaction.editReply(data)
    } else if (interaction.deferred) {
        return interaction.channel.send(data)
    } else {
        return interaction.reply(data)
    }
}

module.exports = interactionReply
