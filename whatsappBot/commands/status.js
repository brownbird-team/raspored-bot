const { ChatTypes } = require('whatsapp-web.js');
const daj_f_baza = require('./../databaseQueriesWap');

module.exports = {
    name: "status",
    aliases: [],
    adminOnly: false,
    noPrefix: true,
    type: 'all',
    hasList: false,
    listIdPrefix: 'status',

    async execute (msg, kontakt, client) {
        let klijent = await daj_f_baza.dajKontakt(kontakt.broj);
        client.sendMessage(msg.from, `
Razred: ${klijent.razred ? klijent.razred.ime : "nije postavljen" } \n
Vaš prefix je: "${klijent.prefix}"\n
Vaša subskripcija je: ${klijent.salji_izmjene}\n
Vaš saljisve je: ${klijent.salji_sve}\n`);
    }
}