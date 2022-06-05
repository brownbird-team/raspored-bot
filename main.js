const database = require("./databaseConnect.js");
const discord = require("./discordBot/main.js");
const strugac = require('./webScraper/WebScraperLoop.js');
const strugacOnce = require('./webScraper/webScraperMain.js');

const start = async () => {
    // Napravi check za bazu
    await database.databaseInit();
    // Inicijaliziraj strugač
    await strugacOnce.sql();
    // Pokreni discord Bota
    await discord.startDiscordBot();
    // Pokreni email web sucelje
    const emailWeb = require('./emailBot/app.js');
    // Pokreni whatsapp bota
    const whatsapp = require('./whatsappBot/main.js');
    // Pokreni strugač za stalno
    await strugac.strugacRun(true);
}

start();