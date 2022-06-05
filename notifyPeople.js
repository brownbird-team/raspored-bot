discordNotify = require('./discordBot/checkForChanges.js').check;

// Funkcija koju webScraper poziva kada primjeti da je došlo do izmjena
exports.uzbuna = async () => {
    // Pozovi funkciju za obavještavanje ljudi na discordu
    //console.log("Uzbuna -------------------------------------- Pozar")
    await discordNotify();
}