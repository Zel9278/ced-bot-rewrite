const newsAPI = require("newsapi")
const newsapi = new newsAPI(process.env.NEWS_API_KEY)
const moment = require("moment-timezone")

const news = {
    data: {
        name: "news",
        description: "Randomly displays news from Japan.",
    },
    async exec(interaction) {
        newsapi.v2
            .topHeadlines({
                country: "jp",
            })
            .then((news) => {
                const articles = news.articles,
                    res = articles[Math.floor(Math.random() * articles.length)],
                    publishedAt = moment(res.publishedAt)
                        .tz("Asia/Tokyo")
                        .format("YYYY/MM/DD HH:mm"),
                    now = moment()
                        .tz("Asia/Tokyo")
                        .format("YYYY/MM/DD dddd HH:mm")
                interaction.reply({
                    content: `News published in ${publishedAt}.`,
                    embeds: [
                        {
                            author: {
                                name: res.author,
                            },
                            title: res.title,
                            url: res.url,
                            description: res.description,
                            image: {
                                url: res.urlToImage,
                            },
                        },
                    ],
                })
            })
    },
}

module.exports = news
