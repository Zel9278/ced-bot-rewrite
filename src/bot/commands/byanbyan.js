const { spawn } = require("child_process")
const { rmSync, existsSync } = require("fs")
const path = require("path")
const { ApplicationCommandOptionType } = require("discord.js")
const e = require("express")

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
        const audioPath = path.join(
            process.cwd(),
            `SPOILER_byanbyan_${+new Date()}.wav`
        )
        const audioFile = interaction.options.getAttachment("audiofile")

        if (
            !(
                audioFile.name.endsWith(".wav") ||
                audioFile.name.endsWith(".mp3") ||
                audioFile.name.endsWith(".mp4") ||
                audioFile.name.endsWith(".bcstm")
            )
        ) {
            await interaction.reply(
                "Invalid file, must be .mp3 or .wav or .mp4."
            )
            return
        }

        interaction.reply({
            embeds: [
                {
                    title: "Downloading audio file and bassing it to byanbyan...",
                    description: `Original audio file: ${audioFile.name}`,
                    url: audioFile.url,
                    color: 0x00ff00,
                },
            ],
        })

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
            { shell: true, windowsHide: true }
        )
        ffmpeg.on("exit", async () => {
            const msg = await interaction.fetchReply()
            msg.reply({
                content: "ffmpeg ended",
                files: [audioPath],
            })
                .then((data) => {
                    if (existsSync(audioPath)) rmSync(audioPath)
                })
                .catch((err) => {
                    msg.reply(
                        "ffmpeg ended, but I couldn't send the file: " +
                            e.name +
                            "\n```" +
                            err.message +
                            "\n```"
                    )
                    if (existsSync(audioPath)) rmSync(audioPath)
                })
        })
    },
}

module.exports = byanbyan
