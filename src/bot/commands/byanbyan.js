const { spawn } = require("child_process")
const { ApplicationCommandOptionType } = require("discord-api-types/v10")

const byanbyan = {
    data: {
        name: "byanbyan",
        description: "audio byanbyan",
        options: [
            {
                name: "audiofile",
                description: "audio file",
                type: ApplicationCommandOptionType.Attachment,
                required: true,
            },
        ],
    },
    async exec(interaction) {
        const audioPath = `/tmp/SPOILER_byanbyan_${+new Date()}.wav`
        const audioFile = interaction.options.getAttachment("audiofile")

        if (
            !(
                audioFile.name.endsWith(".wav") ||
                audioFile.name.endsWith(".mp3")
            )
        ) {
            await interaction.reply("Invalid file, must be .mp3 or .wav.")
            return
        }

        interaction.reply(
            `Downloading audio file [${audioFile.name}] and bassing it to byanbyan...`
        )

        const ffmpeg = spawn(
            "ffmpeg",
            [
                "-y",
                "-i",
                audioFile.url,
                "-af",
                //"bass=g=600",
                "equalizer=f=1000:width_type=h:width=600:g=10",
                "-af",
                "volume=50dB",
                "-c:a",
                "libopus",
                "-b:a",
                "210k",
                "-f",
                "opus",
                audioPath,
            ],
            { shell: true }
        )
        ffmpeg.on("exit", async () => {
            const msg = await interaction.fetchReply()
            msg.reply({
                content: "ffmpeg ended",
                files: [audioPath],
            })
        })
    },
}

module.exports = byanbyan
