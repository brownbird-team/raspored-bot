const { ChatTypes } = require('whatsapp-web.js');
const dodaj_f_baza = require('./../dodaj_f_za_bazu');
module.exports = {
    name: "saljisve",
    aliases: [],
    adminOnly: false,
    noPrefix: false,
    type: 'all',
    hasList: false,
    listIdPrefix: 'saljisve',

    async execute (msg, kontakt, client) {       
        client.sendMessage(msg.from, 'Raspored bot će vam od sada slati dnevne izmjene automatski, čak i ako nema izmjena za taj dan.');
        sve = 1;
        await dodaj_f_baza.dodaj_salji_izmjene_ako_ih_nema(sve, kontakt.broj);
    }
}