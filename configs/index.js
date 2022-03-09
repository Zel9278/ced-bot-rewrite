const fs = require("fs");
const ignore = ["index.js"];

fs.readdirSync(__dirname).filter(a=>!ignore.includes(a)&&a.endsWith(".js")).forEach(file => {
    const name = file.replace(".js", "");
    exports[name] = require(`./${file}`);
});
