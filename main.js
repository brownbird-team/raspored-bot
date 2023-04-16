//    ____                                    _   ____        _   
//   |  _ \ __ _ ___ _ __   ___  _ __ ___  __| | | __ )  ___ | |_ 
//   | |_) / _` / __| '_ \ / _ \| '__/ _ \/ _` | |  _ \ / _ \| __|
//   |  _ < (_| \__ \ |_) | (_) | | |  __/ (_| | | |_) | (_) | |_ 
//   |_| \_\__,_|___/ .__/ \___/|_|  \___|\__,_| |____/ \___/ \__|
//                  |_|                                           
//
//   Verzija: 3.2.0
//   Made by BrownBird Team
//
//   Raspored bot je aplikacija koja se koristi za obavještavanje učenika
//   osnovne ili srednje škole koja može i ne mora biti u dvije smjene o
//   promjenama u rasporedu sati koje nastaju na dnevnoj bazi
//
//   Aplikacija podržava slanje obavjesti učenicima putem email-a i discord
//   platforme, pomoću discord bota
//
//   Site:   https://brownbird.eu/raspored-bot (not up to date)
//   GitHub: https://github.com/brownbird-team/raspored-bot
//
//   Support: support@brownbird.eu
//

// Dobavi sve datoteke koje je potrebno inicijalizirati i pokrenuti
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

// Glavna funkcija za pokretanje
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

    // Provjeri treba li pokrenuti scraper i pokreni ga ako treba
    if (config.scraper.startScraper) {
        // Inicijaliziraj postavke scrapera
        await scraperHelpers.checkOptions();
        // Pokreni ga
        strugac.run();
    }

    // Inicijaliziraj web postavke
    await webHelpers.checkOptions();
    
    // Provjeri ima li novih izmjena u bazi za poslat emailom
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

// Pokreni sve
start();