const database = require("./databaseConnect.js");
const databaseQueries = require("./databaseQueries.js");
const discord = require("./discordBot/main.js");
const strugac = require('./webScraper/WebScraperLoop.js');
const strugacOnce = require('./webScraper/webScraperMain.js');
const emailCheck = require('./emailBot/checkForChanges.js');
const sendEmail = require("./emailBot/sendEmail.js");
const databaseEmail = require("./emailBot/databaseQueriesEmail.js");
const webHelpers = require("./webInterface/helperFunctionsWeb.js");
const notifier = require('./globalErrorNotifier.js');
const errors = require('./errors.js');

const webServer = require('./webInterface/app.js');

const start = async () => {
    // Napravi check za bazu
    await database.databaseInit();
    // Inicijaliziraj email
    await sendEmail.init();

    // Pokreni strugač prvi put
    await strugacOnce.sql();
    // Inicijaliziraj web postavke
    await webHelpers.checkOptions();
    
    // Provjeri ima li izmjena za poslat emailom
    try {
        await emailCheck.check();
    } catch (err) {
        notifier.handle(err);
    }

    // Startaj web aplikaciju
    await webServer.start();

    // Pokreni discord Bota
    await discord.startDiscordBot();

    // Pokreni strugač za stalno
    await strugac.strugacRun(true);
}

start();