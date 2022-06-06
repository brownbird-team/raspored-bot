const { Client, LocalAuth } = require('whatsapp-web.js');
const daj_f_baza = require("./daj_f_za_bazu");
const baza_wap = require('./databaseQueriesWap.js');
const baza = require('../databaseQueries.js');
const client = require('./main.js');


exports.ima_li_izmjene = async () => {
    if (client === undefined) {
        return;
    }
    const brojevi = await daj_f_baza.daj_brojeve_sa_salji_izmjene();
    let kontakt;
    for (let broj in brojevi) {
        kontakt = await baza_wap.dajKontakt(brojevi[broj].broj);
    }

    for (broj in brojevi) {
        const razred_data = await baza.dajRazredById(kontakt.razred.id);
        if (razred_data.id) {
            //Dobivanje podataka o klijentovom razredu
            let izmjena = await baza.dajZadnju(razred_data.id);
            console.log(izmjena);
            //Ispis izmjena korisniku
            let izmjena_test = `Za razred: ${razred_data.ime}`;
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

            client.sendMessage(kontakt.broj, izmjena_test);
            await dodaj_f_baza.dodaj_zadnju_poslanu(izmjena.id, kontakt.broj);
        }
    }

}