// Dodaj potrebne funkcije iz ostalih datoteka
const { dajRazred } = require("../databaseQueries.js");
const { promiseQuery } = require("../databaseConnect.js");

// Povuci podatke iz baze za traženi kontakt (ili grupu)
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
            grupa: kontakt.grupa,
            prefix: kontakt.prefix,
            zadnja_poslana: kontakt.zadnja_poslana,
            salji_izmjene: kontakt.salji_izmjene,
            salji_sve: kontakt.salji_sve
        }
        
        if (kontakt.razred_id === null) {
            objekt.razred = null;
        } else {
            objekt.razred = await dajRazred(kontakt.razred_id);
        }
        resolve(objekt);
    });
}

// Dodaj kontakt (ili grupu)
exports.dodajKontakt = (broj, grupa) => {
    return new Promise(async (resolve) => {
        await promiseQuery(`INSERT INTO wap_kontakti (broj, grupa) VALUES ('${broj}', ${grupa})`);
        resolve("done");
    });
}

// Izmjeni podatke u bazi za kontakt (ili grupu)
exports.izmjeniKontakt = async (objekt) => {
    return new Promise(async (resolve, reject) => {
        if (objekt.hasOwnProperty('broj')) {
            objekt.id = objekt.broj;
        } else if (!objekt.hasOwnProperty('id')) {
            reject('kontakt not defined');
            return;
        }

        let query = 'UPDATE wap_kontakti SET';
        let zarez = false;

        if (objekt.hasOwnProperty('razred')) {
            if (zarez) query += ',';
            query += ` razred_id = ${objekt.razred}`;
            zarez = true;
        }
        if (objekt.hasOwnProperty('prefix')) {
            if (zarez) query += ',';
            query += ` prefix = '${objekt.prefix}'`
            zarez = true;
        }
        if (objekt.hasOwnProperty('zadnja_poslana')) {
            if (zarez) query += ',';
            query += ` zadnja_poslana = ${objekt.zadnja_poslana}`
            zarez = true;
        }
        if (objekt.hasOwnProperty('subscribed')) {
            if (zarez) query += ',';
            query += ` salji_izmjene = ${objekt.subscribed}`
            zarez = true;
        }
        if (objekt.hasOwnProperty('sve')) {
            if (zarez) query += ',';
            query += ` salji_sve = ${objekt.sve}`
            zarez = true;
        }

        if (query === 'UPDATE wap_kontakti SET') {
            reject('nothing to update');
        } else {
            query += ` WHERE broj = '${objekt.id}'`
            await promiseQuery(query);
            resolve('done');
        }
    })
}

// Izlistaj sve aktivne razrede po abecednom redu
exports.dajRazrede = () => {
    return new Promise(async (resolve) => {
        const razredi = await promiseQuery('SELECT * FROM general_razred WHERE aktivan = 1 ORDER BY ime ASC');
        resolve(razredi);
    });
}