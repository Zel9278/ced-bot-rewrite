function progressBar(progress, max, [t,f] = ["▓", "░"]) {
    return [...Array(max)].map((v, i) => {
        return progress > i ? t : f;
    }).join("");
};

module.exports = progressBar;
