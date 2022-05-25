const { ChatTypes } = require('whatsapp-web.js');
const dodaj_f_baza = require('./../dodaj_f_za_bazu');
module.exports = {
    name: "nesaljisve",
    aliases: [],
    adminOnly: false,
    noPrefix: false,
    type: 'all',
    hasList: false,
    listIdPrefix: 'nesaljisve',

    async execute (msg, kontakt, client) {       
        client.sendMessage(msg.from, '```Raspored bot vam od sada neće slati dnevne izmjene automatski, čak i ako nema izmjena za taj dan.```');
        sve = 0;
        await dodaj_f_baza.dodaj_ne_salji_izmjene_ako_ih_nema(sve, kontakt.broj);
    }
}