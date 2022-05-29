const { ChatTypes } = require('whatsapp-web.js');
const dodaj_f_baza = require('./../dodaj_f_za_bazu');
module.exports = {
    name: "unsubscribe",
    aliases: [],
    adminOnly: false,
    noPrefix: false,
    type: 'all',
    hasList: false,
    listIdPrefix: 'unsubscribe',

    async execute (msg, kontakt, client) {
        client.sendMessage(msg.from, 'Raspored bot vam neće od sada slati dnevne izmjene automatski.');
        sub = 0;
        await dodaj_f_baza.dodaj_ne_salji_izmjene(sub, kontakt.broj);
    }
}