const Twitter = require("twit");
const moment = require("moment-timezone");
const tc = new Twitter({
    consumer_key        : process.env.TWITTER_CONSUMER_KEY,
    consumer_secret     : process.env.TWITTER_CONSUMER_SECRET,
    access_token        : process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret : process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const twitter = {
    data: {
        name: "twitter",
        description: "Searches for and displays Twitter users.",
        options: [
            {
                name: "id",
                description: "The ID of the user to search for.",
                type: "STRING",
                required: true
            }
        ]
    },
    isGuildCommand: true,
    async exec(interaction) {
        const id = interaction.options.getString("id");
        const params = { screen_name: id };

        tc.get("users/show", params, async (err, data, response) => {
            if(err) return await interaction.reply({
                embeds: [
                    {
                        title: `Error`,
                        description: `StatusCode: ${err.statusCode}\n------------------\n${err.allErrors.map(e => `${e.code}: ${e.message}`).join("\n")}`,
                        color: "FF0000"
                    }
                ]
            });

            const url = data.url?`${data.url}`:"no data";
            const description = data.description?`${data.description}`:"no data";
            const location = data.location?`${data.location}`:"no data";
            const latestTweet = data.status?data.status.text:"Hidden";
            const createdAt = moment(new Date(data.created_at)).tz("Asia/Tokyo").format("YYYY/MM/DD-HH:mm");

            await interaction.reply({
                embeds: [
                    {
                        title: `${data.name}(@${data.screen_name})`,
                        url: `https://twitter.com/${data.screen_name}`,
                        description: description,
                        thumbnail: {
                            url: data.profile_image_url,
                        },
                        image: {
                            url: data.profile_banner_url,
                        },
                        color: 52479,
                        fields: [
                            {
                                name: "link",
                                value: url,
                            },
                            {
                                name: "location",
                                value: location,
                            },
                            {
                                name: "latest tweet",
                                value: latestTweet,
                            },

                            {
                                name: "tweets",
                                value: data.statuses_count.toString(),
                                inline: true,
                            },
                            {
                                name: "follow",
                                value: data.friends_count.toString(),
                                inline: true,
                            },
                            {
                                name: "followers",
                                value: data.followers_count.toString(),
                                inline: true,
                            },
                            {
                                name: "listed",
                                value: data.listed_count.toString(),
                                inline: true,
                            },
                            {
                                name: "♡",
                                value: data.favourites_count.toString(),
                                inline: true,
                            },
                            {
                                name: "created(jst)",
                                value: createdAt,
                                inline: true,
                            }
                        ]
                    }
                ]
            });
        });
    }
};

module.exports = twitter;
