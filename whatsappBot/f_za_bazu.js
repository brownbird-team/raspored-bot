// Dodaj potrebne funkcije iz ostalih datoteka
const { dajRazred } = require("../databaseQueries.js");
const { promiseQuery } = require("../databaseConnect.js");

//Dodaj resetirani prefix u bazu
exports.reset_prefix = (broj) => {
    return new Promise(async (resolve) => {
        let baza_reset_prefix = `UPDATE wap_kontakti SET prefix = '.' WHERE broj = ${broj}`;
        await promiseQuery(baza_reset_prefix);
        resolve("done");
    });
}

