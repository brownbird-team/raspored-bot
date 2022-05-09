// Dodaj potrebne funkcije iz ostalih datoteka
const { dajRazred } = require("../databaseQueries.js");
const { promiseQuery } = require("../databaseConnect.js");


// Dodaj broj mobitela u bazu
exports.dodaj_broj = (broj) => {
    return new Promise(async (resolve) => {
        let br_mob = `INSERT INTO wap_kontakti (broj) VALUES ('${broj}')`;
        await promiseQuery(br_mob);
        resolve("done");
    });
}

//Dodaj razred_id u bazu
exports.dodaj_razred_id = (razred_id, broj) => {
    return new Promise(async (resolve) => {
        let raz_id = `UPDATE wap_kontakti SET razred_id = ${razred_id} WHERE broj = ${broj}`;
        await promiseQuery(raz_id);
        resolve("done");
    });
}

//Dodaj prefix u bazu
exports.dodaj_prefix = (prefix, broj) => {
    return new Promise(async (resolve) => {
        let baza_prefix = `UPDATE wap_kontakti SET prefix = '${prefix}' WHERE broj = ${broj}`;
        await promiseQuery(baza_prefix);
        resolve("done");
    });
}

//Dodaj zadnju poslanu u bazu
exports.dodaj_zadnju_poslanu = (izmjena_test, broj) => {
    return new Promise(async (resolve) => {
        let baza_zadnja_izmjena = `UPDATE wap_kontakti SET zadnja_poslana = ${izmjena_test} WHERE broj = ${broj}`;
        await promiseQuery(baza_zadnja_izmjena);
        resolve("done");
    });
}


//Dodaj subscribe u bazu
exports.dodaj_salji_izmjene = (sub, broj) => {
    return new Promise(async (resolve) => {
        let baza_salji_izmjene = `UPDATE wap_kontakti SET salji_izmjene = ${sub} WHERE broj = ${broj}`;
        await promiseQuery(baza_salji_izmjene);
        resolve("done");
    });
}


//Dodaj unsubscribe u bazu
exports.dodaj_ne_salji_izmjene = (sub, broj) => {
    return new Promise(async (resolve) => {
        let baza_ne_salji_izmjene = `UPDATE wap_kontakti SET salji_izmjene = ${sub} WHERE broj = ${broj}`;
        await promiseQuery(baza_ne_salji_izmjene);
        resolve("done");
    });
}


//Dodaj šalji sve u bazu
exports.dodaj_salji_izmjene_ako_ih_nema = (sve, broj) => {
    return new Promise(async (resolve) => {
        let baza_salji_izmjene_ako_ih_nema = `UPDATE wap_kontakti SET salji_sve = ${sve} WHERE broj = ${broj}`;
        await promiseQuery(baza_salji_izmjene_ako_ih_nema);
        resolve("done");
    });
}


//Dodaj ne šalji sve u bazu
exports.dodaj_ne_salji_izmjene_ako_ih_nema = (sve, broj) => {
    return new Promise(async (resolve) => {
        let baza_ne_salji_izmjene_ako_ih_nema = `UPDATE wap_kontakti SET salji_sve = ${sve} WHERE broj = ${broj}`;
        await promiseQuery(baza_ne_salji_izmjene_ako_ih_nema);
        resolve("done");
    });
}


