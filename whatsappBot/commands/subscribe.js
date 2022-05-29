const { ChatTypes } = require('whatsapp-web.js');
const dodaj_f_baza = require('./../dodaj_f_za_bazu');
module.exports = {
    name: "subscribe",
    aliases: [],
    adminOnly: false,
    noPrefix: false,
    type: 'all',
    hasList: false,
    listIdPrefix: 'subscribe',

    async execute (msg, kontakt, client) {       
        client.sendMessage(msg.from, 'Raspored bot će vam od sada slati dnevne izmjene automatski.');
        let sub = 1;
        await dodaj_f_baza.dodaj_salji_izmjene(sub, kontakt.broj);
    }
}