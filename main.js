const database = require("./databaseConnect.js");
const discord = require("./discordBot/main.js");
const strugac = require('./webScraper/WebScraperLoop.js');
const strugacOnce = require('./webScraper/webScraperMain.js');

const start = async () => {
    await database.databaseInit();
    await strugacOnce.sql();
    await discord.startDiscordBot();
    await strugac.strugacRun(true);
}

start();