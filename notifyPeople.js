const discordNotify = require('./discordBot/checkForChanges.js');
const emailNotify = require('./emailBot/checkForChanges.js');

const notifier = require('./globalErrorNotifier.js');

// Funkcija koju webScraper poziva kada primjeti da je došlo do izmjena
exports.uzbuna = async () => {
    // Pozovi funkciju za obavještavanje ljudi na discordu
    try {
        await discordNotify.check();
    } catch (err) {
        notifier.handle(err);
    }
    // Pozovi funkcije za obavještavanje ljudi putem emaila
    try {
        await emailNotify.check();
    } catch (err) {
        notifier.handle(err);
    }
}