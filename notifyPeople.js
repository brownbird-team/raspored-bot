const discordNotify = require('./discordBot/checkForChanges.js');
const emailNotify = require('./emailBot/checkForChanges.js');

//emailNotify = require('./emailBot/rasporedMain.js');

// Funkcija koju webScraper poziva kada primjeti da je došlo do izmjena
exports.uzbuna = async () => {
    // Pozovi funkciju za obavještavanje ljudi na discordu
    //console.log("Uzbuna -------------------------------------- Pozar")
    await discordNotify.check();
    await emailNotify.check()
    //await emailNotify.main();
}