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


//Daj sve brojeve iz baze
exports.daj_brojeve = () => {
    return new Promise(async (resolve) => {
        let baza_brojevi = `SELECT broj FROM wap_kontakti`;
        let brojevi = await promiseQuery(baza_brojevi);
        resolve(brojevi);
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

//Dodaj resetirani prefix u bazu
exports.reset_prefix = (broj) => {
    return new Promise(async (resolve) => {
        let baza_reset_prefix = `UPDATE wap_kontakti SET prefix = '.' WHERE broj = ${broj}`;
        await promiseQuery(baza_reset_prefix);
        resolve("done");
    });
}