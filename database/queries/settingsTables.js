const db = require('../connect');

// Provjerava jesu li svi potrebni optioni iz liste kreirani u danoj tablici,
// lista je lista objekata { name: 'ime', value: 'vrijednost', defaultOk: true }
// čija svojstva su ime optiona, vrijednost optiona, i je li u redu ako je vrijednost
// optiona jednaka zadanoj vrijednosti optiona
// Funkcija vraća true ako je sve u redu, a false ako neki optioni imaju zadanu vrijednost
// iako nebi smjeli
// logFunction je pozvana za ispis opisa trenutne operacije
exports.checkOptions = async (tableName, optionsList, logFunction) => {
    let allOk = true;
    for (let i in optionsList) {
        const value = await this.getOption(tableName, optionsList[i].name);

        if (value === null) {
            if (logFunction)
                logFunction(`Record "${optionsList[i].name}" not found in table "${tableName}" inserting record and setting it to "${optionsList[i].value}"`);
            await this.setOption(tableName, optionsList[i].name, optionsList[i].value);
            if (!optionsList[i].defaultOk)
                allOk = false;
        } else if (value === optionsList[i].value && !optionsList[i].defaultOk) {
            allOk = false;
        }
    }

    return allOk;
}

// Vraća vrijednost optiona iz baze iz dane tablice ili null ako option
// nije definiran, tablica mora biti oblika settings tablica krairanih
// pri inicijalizaciji baze
exports.getOption = async (tableName, option) => {
    const query = `SELECT * FROM ${tableName} WHERE option = '${option}'`;
    let result = await db.Connection.query(query);
    let value;
    if(result.length === 0) {
        value = null;
    } else {
        value = result[0].value;
    }
    return value;
}

// Postavlja vrijednost optiona u bazi ili ga kreira ako ne postoji u danoj tablici,
// tablica mora biti oblika settings tablica kreiranih pri inicijalizaciji baze
exports.setOption = async (tableName, option, value) => {
    const check = await exports.getOption(tableName, option);
    let query;
    if(check !== null) {
        query = `UPDATE ${tableName} SET value = '${value}' WHERE option = '${option}'`;
    } else {
        query = `INSERT INTO ${tableName} (option, value) VALUES ('${option}', '${value}')`;
    }
    await db.Connection.query(query);
    return 'done';
}

// Briše danu postavku (option) is dane tablice sa postavkama
exports.deleteOption = async (tableName, option) => {
    const query = `DELETE FROM ${tableName} WHERE option = '${option}'`;
    await db.Connection.query(query);
    return 'done';
}