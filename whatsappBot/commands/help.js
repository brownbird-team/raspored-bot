const fs = require('fs');
const baza = require('./../databaseQueriesWap.js');

// Povuci help iz datoteke helpMessage.txt
const help = fs.readFileSync('./whatsappBot/helpMessage.txt', 'utf8');
// Funkcija za upaciti prefix u help
const prepareHelp = (prefix) => help.replaceAll('%prefix%', prefix);

module.exports = {
    name: 'help',                 // Ime naredbe
    aliases: [],                  // Dodatni nazivi naredbe
    adminOnly: false,             // Ako je chat grupa, samo admin može izvršiti naredbu
    noPrefix: false,              // Treba li upisati prefix prije izvršavanja naredbe
    type: 'all',                  // Gdje treba odgovoriti na poruku (all, group, private)
    hasList: false,               // Sadrži li naredba listu
    listIdPrefix: '',             // Početak ID-a kojeg lista vraća

    // Funkcija izvršena na poziv naredbe
    async execute(msg, kontakt, client) {
        // Formatiraj i pošalji help
        client.sendMessage(msg.from, prepareHelp(kontakt.prefix));
    }
}