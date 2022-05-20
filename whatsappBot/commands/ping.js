module.exports = {
    name: 'ping',                 // Ime naredbe
    aliases: [],                  // Dodatni nazivi naredbe
    adminOnly: false,             // Ako je chat grupa, samo admin može izvršiti naredbu
    noPrefix: false,              // Treba li upisati prefix prije izvršavanja naredbe
    type: 'all',                  // Gdje treba odgovoriti na poruku (all, group, private)
    hasList: false,               // Sadrži li naredba listu
    listIdPrefix: '',             // Početak ID-a kojeg lista vraća

    // Funkcija izvršena na poziv naredbe
    async execute(msg, kontakt, client) {
        // Pošalji Pong korisniku
        await msg.reply('Pong !');
    }
}