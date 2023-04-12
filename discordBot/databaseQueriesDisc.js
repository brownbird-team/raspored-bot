// Dodaj funkcije komuniciranje s bazom
const db = require('../database/connect.js')
// Dodaj funkcije za dobivanje razreda
const {getClassByName,getClassById,getAllClasses} = require('../database/queries/classInfo.js');
//const { dajRazred, getClassById, getOption} = require("./../databaseQueries.js");
const {setOption,getOption} = require('../database/queries/settingsTables.js')
// Daj podatke za traženi server po ID-u
exports.getServer = async (server_id) => {
    // Zatraži podatke za server
    let result = await db.Connection.query(`SELECT * FROM ras_disc_server WHERE server_id = '${server_id}'`);
    // Ako server postoji u bazi nastavi
    if (result.length === 0) {
        return null;
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
        objekt.razred = await getClassById({class_id:server.razred_id});
    }
    // Zatraži podatke za kanale u tom serveru
    let kanali = await db.Connection.query(`SELECT * FROM ras_disc_channel WHERE server_id = '${server_id}'`);
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
                objekt.kanali[kanali[i].kanal_id].razred = await getClassByName({name:kanali[i].razred_id});
            }
        }
    }

    return objekt;
}

// Daj podatke za traženi kanal po ID-u
exports.getKanal = async(kanal_id)=> {
    // Zatraži podatke za kanal
    let result = await db.Connection.query(`SELECT * FROM ras_disc_channel WHERE channel_id= '${kanal_id}'`);
    // Ako kanal postoji u bazi nastavi
    if (result.length === 0) {
        return null;
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
        objekt.razred = await getClassById({class_id: kanal.razred_id});
    }

    return objekt;
}

// Izmjeni podatke za server
// Prima objekt sa novim podacima kao argument
exports.updateServer = async (objekt) => {
    // Provjeri je li ID servera definiran u objektu
    if (!("id" in objekt)) {
        throw new Error("server not defined");
    }
    // Započni update query
    let query = "UPDATE ras_disc_server SET"
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
    if (query !== "UPDATE ras_disc_server SET") {
        query += ` WHERE server_id = '${objekt.id}'`;
        await db.Connection.query(query);
        return "done";
    } else {
        return "nothing to update";
    }
}

// Izmjeni podatke za kanal
// Prima objekt sa novim podacima kao argument
exports.updateKanal = async (objekt) => {
    // Provjeri je li ID kanala definiran u objektu
    if (!("id" in objekt)) {
        throw "kanal not defined";
    }
    // Započni update query
    let query = "UPDATE ras_disc_channel SET"
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
    if (query !== "UPDATE ras_disc_channel SET") {
        query += ` WHERE channel_id= '${objekt.id}'`;
        await db.Connection.query(query);
        return "done";
    } else {
        return "nothing to update";
    }
}

// Dodaj server u bazu
exports.addServer = async (server_id) => {
    const query = `INSERT INTO ras_disc_server (server_id) VALUES ('${server_id}')`;
    await db.Connection.query(query);
    return "done";
}

// Dodaj kanal u bazu
exports.addKanal = async (server_id, kanal_id) => {
    let query;
    if (server_id)
        query = `INSERT INTO ras_disc_channel (channel_id, server_id) VALUES ('${kanal_id}', '${server_id}')`;
    else
        query = `INSERT INTO ras_disc_channel(channel_id)VALUES ('${kanal_id}')`;
    await db.Connection.query(query);
    return "done";
}

// Ukloni server iz baze
exports.removeServer = async (server_id) => {
    // Ukloni sve kanale u tom serveru iz baze
    const kanalQuery = `DELETE FROM ras_disc_channel WHERE server_id = '${server_id}`;
    // Ukloni server iz baze
    const serverQuery = `DELETE FROM ras_disc_server WHERE server_id = '${server_id}'`;
    // Izvrši Query
    await db.Connection.query(kanalQuery + '; ' + serverQuery);
    return "done";
}

// Ukloni kanal iz baze
exports.removeKanal = async(kanal_id)=> {
    const query = `DELETE FROM ras_disc_channel WHERE channel_id= '${kanal_id}'`;
    await db.Connection.query(query);
    return "done";
}

// Daj listu svih servera iz baze (samo njihove ID-jeve)
exports.listServer = async () => {
    const query = `SELECT server_id FROM ras_disc_server`;
    let result = await db.Connection.query(query);
    let lista = [];
    for (let i = 0; i < result.length; i++) {
        lista.push(result[i].server_id);
    }
    return lista;
}

// Daj listu svih kanala iz baze (samo njihove ID-jeve)
exports.listKanal = async () => {
    const query = `SELECT channel_id FROM ras_disc_channel`;
    let result = await db.Connection.query(query);
    let lista = [];
    for (let i = 0; i < result.length; i++) {
        lista.push(result[i].kanal_id);
    }
    return lista;
}

// Vrati vrijednost optiona iz baze
exports.getOption = async (option) => {
    return await getOption('ras_disc_setting', option);
}

// Postavi novu vrijednost na option i kreiraj ga ako ne postoji
exports.setOption = async (option, value) => {
    return await setOption('ras_disc_setting', option, value);
}

// Provjeri koji je prefix za traženi kanal
exports.getPrefix = async (server_id, kanal_id) => {
    let result;
    // Ako je argument kanal definiran, i ako kanal postoji u bazi, te ako je za
    // njega postavljen prefix vrati taj prefix
    if (kanal_id != null) {
        result = await db.Connection.query(`SELECT prefix FROM ras_disc_channel WHERE channel_id= '${kanal_id}'`);
        if (result.length !== 0)
            if (result[0].prefix) {
                return result[0].prefix
            }
    }
    // Ako je argument server definiran, i ako server postoji u bazi, te ako je za
    // njega postavljen prefix vrati taj prefix
    if (server_id != null) {
        result = await db.Connection.query(`SELECT prefix FROM ras_disc_server WHERE server_id = '${server_id}'`);
        if (result.length !== 0)
            if (result[0].prefix) {
                return result[0].prefix;
            }
    }
    // Ako niš nije postavljeno vrati default prefix
    const defaultPrefix = await exports.getOption("prefix");
    return defaultPrefix
}