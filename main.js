const database = require("./databaseConnect.js");
const discord = require("./discordBot/main.js");

const start = async () => {
    await database.databaseInit();
    await discord.startDiscordBot();
}

start();