// Dodaj potrebne funkcije iz ostalih datoteka
const { promiseQuery } = require("./../databaseConnect.js");
const { dajRazred, dajRazredById } = require("./../databaseQueries.js");

// Daj podatke za traženi server po ID-u
exports.getServer = (server_id) => {
    return new Promise(async (resolve, reject) => {
        // Zatraži podatke za server
        let result = await promiseQuery(`SELECT * FROM disc_serveri WHERE server_id = '${server_id}'`);
        // Ako server postoji u bazi nastavi
        if (result.length === 0) {
            resolve(null);
            return;
        }
        let server = result[0];
        // Kreiraj objekt sa podacima za server
        let objekt = {
            id: server.server_id,
            prefix: server.prefix
        }
        // Ako je zadan razred za server zatraži podatke o razredu
        if (server.razred_id === null) {
            objekt.razred = null;
        } else {
            objekt.razred = await dajRazredById(server.razred_id);
        }
        // Zatraži podatke za kanale u tom serveru
        let kanali = await promiseQuery(`SELECT * FROM disc_kanali WHERE server_id = '${server_id}'`);
        // Ako je barem jedan kanal dodan za server
        if (kanali.length === 0) {
            objekt.kanali = null;
        } else {
            objekt.kanali = {};
            // Dodaj podatke za kanal u objekt
            for (let i = 0; i < kanali.length; i++) {
                objekt.kanali[kanali[i].kanal_id] = {
                    prefix: kanali[i].prefix,
                    zadnja_poslana: kanali[i].zadnja_poslana,
                    mute: (kanali[i].salji_izmjene === 1) ? true : false,
                    salji_sve: (kanali[i].salji_sve === 1) ? true : false
                }
                // Ako je zadan razred za kanal zatraži podatke o razredu
                if (kanali[i].razred_id === null) {
                    objekt.kanali[kanali[i].kanal_id].razred = null;
                } else {
                    objekt.kanali[kanali[i].kanal_id].razred = await dajRazred(kanali[i].razred_id);
                }
            }
        }

        resolve(objekt);
    });
}

// Daj podatke za traženi kanal po ID-u
exports.getKanal = (kanal_id) => {
    return new Promise(async (resolve, reject) => {
        // Zatraži podatke za kanal
        let result = await promiseQuery(`SELECT * FROM disc_kanali WHERE kanal_id = '${kanal_id}'`);
        // Ako kanal postoji u bazi nastavi
        if (result.length === 0) {
            resolve(null);
            return;
        }
        let kanal = result[0];
        // Kreiraj objekt sa podacima za kanal
        let objekt = {
            id: kanal.kanal_id,
            server: kanal.server_id,
            prefix: kanal.prefix,
            zadnja_poslana: kanal.zadnja_poslana,
            mute: (kanal.salji_izmjene === 1) ? false : true,
            salji_sve: (kanal.salji_sve === 1) ? true : false
        }
        // Ako je zadan razred za kanal zatraži podatke o razredu
        if (kanal.razred_id === null) {
            objekt.razred = null;
        } else {
            objekt.razred = await dajRazredById(kanal.razred_id);
        }

        resolve(objekt);
    });
}

// Izmjeni podatke za server
// Prima objekt sa novim podacima kao argument
exports.updateServer = (objekt) => {
    return new Promise(async (resolve, reject) => {
        // Provjeri je li ID servera definiran u objektu
        if (!("id" in objekt)) {
            reject("server not defined");
            return;
        }
        // Započni update query
        let query = "UPDATE disc_serveri SET"
        // Ukoliko je više od jednog svojstva izmjenjeno
        // potrebno je dodati zarez između
        let zarez = false;
        // Provjeri za svaki od mogućih svojstva objekta
        // Ako postoji dodaj njegovu vrijednost u update Query
        if ("prefix" in objekt) {
            if (zarez) query += ",";
            query += ` prefix = '${objekt.prefix}'`;
            zarez = true;
        }
        if ("razred" in objekt) {
            if (zarez) query += ",";
            query += ` razred_id = ${objekt.razred}`;
            zarez = true;
        }
        // Ako je barem jedno svojstvo izmjenjeno
        // Izvrši Query
        if (query !== "UPDATE disc_serveri SET") {
            query += ` WHERE server_id = '${objekt.id}'`;
            await promiseQuery(query);
            resolve("done");
        } else {
            reject("nothing to update");
        }
    });
}

// Izmjeni podatke za kanal
// Prima objekt sa novim podacima kao argument
exports.updateKanal = (objekt) => {
    return new Promise(async (resolve, reject) => {
        // Provjeri je li ID kanala definiran u objektu
        if (!("id" in objekt)) {
            reject("kanal not defined");
            return;
        }
        // Započni update query
        let query = "UPDATE disc_kanali SET"
        // Ukoliko je više od jednog svojstva izmjenjeno
        // potrebno je dodati zarez između
        let zarez = false;
        // Provjeri za svaki od mogućih svojstva objekta
        // Ako postoji dodaj njegovu vrijednost u update Query
        if ("prefix" in objekt) {
            if (zarez) query += ",";
            query += ` prefix = '${objekt.prefix}'`;
            zarez = true;
        }
        if ("razred" in objekt) {
            if (zarez) query += ",";
            query += ` razred_id = ${objekt.razred}`;
            zarez = true;
        }
        if ("zadnja_poslana" in objekt) {
            if (zarez) query += ",";
            query += ` zadnja_poslana = ${objekt.zadnja_poslana}`;
            zarez = true;
        }
        if ("mute" in objekt) {
            if (zarez) query += ",";
            query += ` salji_izmjene = ${!objekt.mute}`;
            zarez = true;
        }
        if ("salji_sve" in objekt) {
            if (zarez) query += ",";
            query += ` salji_sve = ${objekt.salji_sve}`;
            zarez = true;
        }
        // Ako je barem jedno svojstvo izmjenjeno
        // Izvrši Query
        if (query !== "UPDATE disc_kanali SET") {
            query += ` WHERE kanal_id = '${objekt.id}'`;
            await promiseQuery(query);
            resolve("done");
        } else {
            reject("nothing to update");
        }
    });
}

// Dodaj server u bazu
exports.addServer = (server_id) => {
    return new Promise(async (resolve, reject) => {
        const query = `INSERT INTO disc_serveri (server_id) VALUES ('${server_id}')`;
        await promiseQuery(query);
        resolve("done");
    });
}

// Dodaj kanal u bazu
exports.addKanal = (server_id, kanal_id) => {
    return new Promise(async (resolve, reject) => {
        let query;
        if (server_id)
            query = `INSERT INTO disc_kanali (kanal_id, server_id) VALUES ('${kanal_id}', '${server_id}')`;
        else
            query = `INSERT INTO disc_kanali (kanal_id) VALUES ('${kanal_id}')`;
        await promiseQuery(query);
        resolve("done");
    });
}

// Ukloni server iz baze
exports.removeServer = (server_id) => {
    return new Promise(async (resolve, reject) => {
        // Ukloni sve kanale u tom serveru iz baze
        const kanalQuery = `DELETE FROM disc_kanali WHERE server_id = '${server_id}`;
        // Ukloni server iz baze
        const serverQuery = `DELETE FROM disc_serveri WHERE server_id = '${server_id}'`;
        // Izvrši Query
        await promiseQuery(kanalQuery + '; ' + serverQuery);
        resolve("done");
    });
}

// Ukloni kanal iz baze
exports.removeKanal = (kanal_id) => {
    return new Promise(async (resolve, reject) => {
        const query = `DELETE FROM disc_kanali WHERE kanal_id = '${kanal_id}'`;
        await promiseQuery(query);
        resolve("done");
    });
}

// Daj listu svih servera iz baze (samo njihove ID-jeve)
exports.listServer = () => {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT server_id FROM disc_serveri`;
        let result = await promiseQuery(query);
        let lista = [];
        for (let i = 0; i < result.length; i++) {
            lista.push(result[i].server_id);
        }
        resolve(lista);
    });
}

// Daj listu svih kanala iz baze (samo njihove ID-jeve)
exports.listKanal = () => {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT kanal_id FROM disc_kanali`;
        let result = await promiseQuery(query);
        let lista = [];
        for (let i = 0; i < result.length; i++) {
            lista.push(result[i].kanal_id);
        }
        resolve(lista);
    });
}

// Vrati vrijednost optiona iz baze
exports.getOption = (option) => {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT * FROM disc_settings WHERE option = '${option}'`;
        let result = await promiseQuery(query);
        let objekt;
        if(result.length === 0) {
            objekt = null;
        } else {
            objekt = {
                id: result[0].id,
                option: result[0].option,
                value: result[0].value
            }
        }
        resolve(objekt);
    });
}

// Postavi novu vrijednost na option i kreiraj ga ako ne postoji
exports.setOption = (option, value) => {
    return new Promise(async (resolve, reject) => {
        const check = await exports.getOption(option);
        let query;
        if(check !== null) {
            query = `UPDATE disc_settings SET value = '${value}' WHERE option = '${option}'`;
        } else {
            query = `INSERT INTO disc_settings (option, value) VALUES ('${option}', '${value}')`;
        }
        await promiseQuery(query);
        resolve("done");
    });
}

// Provjeri koji je prefix za traženi kanal
exports.getPrefix = (server_id, kanal_id) => {
    return new Promise(async (resolve, reject) => {
        let result;
        // Ako je argument kanal definiran, i ako kanal postoji u bazi, te ako je za
        // njega postavljen prefix vrati taj prefix
        if (kanal_id != null) {
            result = await promiseQuery(`SELECT prefix FROM disc_kanali WHERE kanal_id = '${kanal_id}'`);
            if (result.length !== 0)
                if (result[0].prefix) {
                    resolve(result[0].prefix);
                    return;
                }
        }
        // Ako je argument server definiran, i ako server postoji u bazi, te ako je za
        // njega postavljen prefix vrati taj prefix
        if (server_id != null) {
            result = await promiseQuery(`SELECT prefix FROM disc_serveri WHERE server_id = '${server_id}'`);
            if (result.length !== 0)
                if (result[0].prefix) {
                    resolve(result[0].prefix);
                    return;
                }
        }
        // Ako niš nije postavljeno vrati default prefix
        const defaultPrefix = await exports.getOption("prefix");
        resolve(defaultPrefix.value);
    });
}