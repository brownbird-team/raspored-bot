const { ChatTypes } = require('whatsapp-web.js');
const baza = require('../../databaseQueries.js');
const dodaj_f_baza = require('../dodaj_f_za_bazu');
module.exports = {
    name: "raspored",
    aliases: ["r"],
    adminOnly: false,
    noPrefix: false,
    type: 'all',
    hasList: false,
    listIdPrefix: 'r',

    async execute (msg, kontakt, client) {
        if (kontakt.razred) {
            //Dobivanje podataka o klijentovom razredu
            let izmjena = await baza.dajZadnju(kontakt.razred.id);
            console.log(izmjena);
            //Ispis izmjena korisniku
            let izmjena_test = `Za razred: ${kontakt.razred.ime}`;
            izmjena_test += `\n${izmjena.naslov}`;
            if (izmjena.ujutro) {
                izmjena_test += '\n*Prijepodne*';
                for (let i = 1; i < 10; i++) {
                    izmjena_test += '\n```'+`${i}. sat = ${izmjena[`sat${i}`]}`+'```';
                }
            }else {
                izmjena_test += '\n*Poslijepodne*';
                for (let i = 1; i < 10; i++) {
                    izmjena_test += '\n```'+`${ (i===1) ? `` : ` `}${i-2}. sat = ${izmjena[`sat${i}`]}`+'```';
                }
            }

            client.sendMessage(msg.from, izmjena_test);
            await baza.izmjeniKontakt({
                broj: kontakt.broj,
                zadnja_poslana: izmjena.id
            });
        }else if (!kontakt.razred) {
            client.sendMessage(msg.from, 'Niste postavili razred.');
        }
    }
}