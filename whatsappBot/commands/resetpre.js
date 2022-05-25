const { ChatTypes } = require('whatsapp-web.js');
const f_baza = require('./../f_za_bazu');
module.exports = {
    name: "resetpre",
    aliases: [],
    adminOnly: false,
    noPrefix: true,
    type: 'all',
    hasList: false,
    listIdPrefix: 'resetpre',

    async execute (msg, kontakt, client) {       
        await f_baza.reset_prefix(kontakt.broj);
        client.sendMessage(msg.from, '```Resetirali ste prefix na "."```');
    }
}