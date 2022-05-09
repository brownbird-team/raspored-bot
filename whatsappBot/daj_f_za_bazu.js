// Dodaj potrebne funkcije iz ostalih datoteka
const { dajRazred } = require("../databaseQueries.js");
const { promiseQuery } = require("./../databaseConnect.js");


//Ako ima kontakta
exports.dajKontakt = (broj) => {
    return new Promise(async (resolve) => {
        const result = await promiseQuery(`SELECT * FROM wap_kontakti WHERE broj = '${broj}'`);
        if (result.length === 0) {
            resolve(null);
            return;
        }
        const kontakt = result[0];        
        
        let objekt = {
            broj: kontakt.broj,
            prefix: kontakt.prefix,
            zadnja_poslana: kontakt.zadnja_poslana,
            salji_izmjene: kontakt.salji_izmjene,
            salji_sve: kontakt.salji_sve
        }
        console.log(kontakt);
        if (kontakt === null) {
            objekt.razred = null;
        }else if (kontakt[0] == null) {
            objekt.razred = null;
        }else {
            objekt.razred = await dajRazred(kontakt.razred_id);
        }
        resolve(objekt);
    });
}

//Daj sve brojeve iz baze
exports.daj_brojeve = () => {
    return new Promise(async (resolve) => {
        let baza_brojevi = `SELECT broj FROM wap_kontakti`;
        let brojevi = await promiseQuery(baza_brojevi);
        resolve(brojevi);
    });
}

//Daj razred_id u bazu
exports.daj_razred_id = (broj) => {
    return new Promise(async (resolve) => {
        let daj_raz_id = `SELECT razred_id FROM wap_kontakti WHERE broj = ${broj}`;
        raz_id = await promiseQuery(daj_raz_id);
        resolve(raz_id[0].razred_id);
    });
}

//Daj prefix iz baze
exports.daj_prefix = (broj) => {
    return new Promise(async (resolve) => {
        let baza_daj_prefix = `SELECT prefix FROM wap_kontakti WHERE broj = ${broj}`;
        let novi_prefix = await promiseQuery(baza_daj_prefix);
        resolve(novi_prefix);
    });
}

//Daj salji izmjene iz baze
exports.daj_salji_izmjene = (broj) => {
    return new Promise(async (resolve) => {
        let baza_daj_salji_izmjene = `SELECT salji_izmjene FROM wap_kontakti WHERE broj = ${broj}`;
        let daj_salji_izmjene = await promiseQuery(baza_daj_salji_izmjene);
        resolve(daj_salji_izmjene);
    });
}

//Daj salji sve iz baze
exports.daj_salji_sve = (broj) => {
    return new Promise(async (resolve) => {
        let baza_daj_salji_sve = `SELECT salji_sve FROM wap_kontakti WHERE broj = ${broj}`;
        let daj_salji_sve = await promiseQuery(baza_daj_salji_sve);
        resolve(daj_salji_sve);
    });
}