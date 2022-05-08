discordNotify = require('./discordBot/checkForChanges.js').check;

// Funkcija koju webScraper poziva kada primjeti da je došlo do izmjena
module.exports = async () => {
    // Pozovi funkciju za obavještavanje ljudi na discordu
    await discordNotify();
}