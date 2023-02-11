const database = require("./databaseConnect.js");
const discord = require("./discordBot/main.js");
const strugac = require('./webScraper/webScraperLoop.js');
const emailCheck = require('./emailBot/checkForChanges.js');
const sendEmail = require("./emailBot/sendEmail.js");
const webHelpers = require("./webInterface/helperFunctionsWeb.js");
const scraperHelpers = require("./webScraper/helperFunctionsScraper.js");
const notifier = require('./globalErrorNotifier.js');

const webServer = require('./webInterface/app.js');
const config = require('./loadConfig.js').getData();

const start = async () => {
    // Napravi check za bazu
    await database.databaseInit();

    // Inicijaliziraj email
    // Ako je u config datoteci traženo da zanemari email error i svejedno
    // pokrene aplikaciju, zanemari errore
    try {
        await sendEmail.init();
    } catch (err) {
        if (!config.email.ignoreEmailErrorsOnStartup)
            throw err;
    }

    // Provjeri 
    await scraperHelpers.checkOptions();
    await strugac.run();
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
}

start();