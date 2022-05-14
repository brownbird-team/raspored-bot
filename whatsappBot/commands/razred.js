const baza = require('./../databaseQueriesWap.js');
const gen = require('./../../databaseQueries.js');
const { List } = require('whatsapp-web.js');

module.exports = {
    name: 'razred',               // Ime naredbe
    aliases: [],                  // Dodatni nazivi naredbe
    adminOnly: true,              // Ako je chat grupa, samo admin može izvršiti naredbu
    noPrefix: false,              // Treba li upisati prefix prije izvršavanja naredbe
    type: 'all',                  // Gdje treba odgovoriti na poruku (all, group, private)
    hasList: true,                // Sadrži li naredba listu
    listIdPrefix: 'razred_',      // Početak ID-a kojeg lista vraća

    // Ako je chat grupa spremi ga u bazu koristeći group id kao primarni ključ
    async execute(msg, client) {
        // Povuci sve razrede iz baze
        const razredi = (await baza.dajRazrede()).filter(raz => raz.aktivan);

        // Kreiraj array elemenata ispisanih u listi
        let rowsArray = [];
        for (const razred of razredi) {
            rowsArray.push({
                id: `${this.listIdPrefix}${razred.id}`,
                title: `Razred ${razred.ime} - ${razred.smjena} smjena`
            });
        }

        // Kreiraj listu
        const myList = new List(
            'Odaberite razred za koji želite primati izmjene',
            'Odaberi Razred',
            [{title: 'Razredi Tehničke škole Ruđera Boškovića', rows: rowsArray}]
        );
        
        // Pošalji listu
        await client.sendMessage(msg.from, myList);
    },

    // Funkcija izvršena na pritisak elementa iz izbornika
    async executeListResponse(msg, client) {
        // Izvuci odabrani razred iz stringa
        const razredId = msg.selectedRowId.slice(this.listIdPrefix.length);
        // Povuci podatke za taj razred iz baze
        const razred = await gen.dajRazredById(parseInt(razredId));

        // Ako razred ne postoji javi grešku
        // Ovo se može dogoditi ako je neki razred onemogućen, a korisnik ima stari
        // izbornik u kojem je razred još postojao
        if (!razred) {
            msg.send(msg.from, 'Došlo je do neočekivane greške');
            return;
        }

        // Nabavi objekt za ovaj chat
        const chat = await msg.getChat();
        // Ako je chat grupa spremi ga u bazu koristeći group id kao primarni ključ
        if (chat.isGroup) {
            baza.izmjeniKontakt({
                id: chat.id.user,
                razred: razred.id
            });
        // Ako je chat private spremi ga u bazu koristeći broj kao primarni ključ
        } else {
            const contact = await chat.getContact();
            baza.izmjeniKontakt({
                broj: contact.number,
                razred: razred.id
            });
        }

        // Pošalji poruku
        client.sendMessage(msg.from, `Vaš razred je postavljen na ${razred.ime}`);
    }
}