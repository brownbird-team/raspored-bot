const { ChatTypes } = require('whatsapp-web.js');
const baza = require('./../../databaseQueries.js');
const dodaj_f_baza = require('./../dodaj_f_za_bazu');
const daj_f_baza = require('./../daj_f_za_bazu');

module.exports = {
    name: "prefix",
    aliases: [],
    adminOnly: false,
    noPrefix: false,
    type: 'all',
    hasList: false,
    listIdPrefix: 'prefix',

    async execute (msg, kontakt, client) {
        let prefix = await daj_f_baza.daj_prefix(kontakt.broj);
        prefix = prefix[0].prefix;
        let komanda = msg.body.slice(prefix.length).split(" ")[0];
        let opcija = msg.body.slice(prefix.length + komanda.length + 1).split(" ")[0];
        prefix = opcija;
        if (prefix) {
            //Provjera da li je prefix samo ACSII kodovi
            if (baza.onlyASCII(prefix)) {
                let novi_prefix = baza.prepareForSQL(prefix);
                client.sendMessage(msg.from, `Vaš novi prefix je "${prefix}"`);
                await dodaj_f_baza.dodaj_prefix(novi_prefix, kontakt.broj);
            }else {
                client.sendMessage(msg.from, `Vaš novi prefix nije validan.`);
            }
        }else if (!prefix) {
            client.sendMessage(msg.from, `Vaš novi prefix ne može biti prazan.`);
        }
    }
}