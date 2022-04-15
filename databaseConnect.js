// Spoji se na bazu i provjeri postojanje svih potrebnih tablica

const mysql = require("mysql");
const { configCheck, getData } = require("./configCheck.js");

configCheck();
const database = getData().database;

const con = mysql.createConnection({
    host: database.host,
    port: database.port,
    user: database.user,
    password: database.pass,
    multipleStatements: true
});

// Spoji se na bazu
con.connect((err) => {
    if (err) throw err;
    console.log(`Uspješno spajanje na bazu ${database.name} - ${database.host}:${database.port}`);

    // Zatraži listu svih tablica u bazi
    con.query(`USE ${database.name}; SHOW TABLES`, (err, result, fields) => {
        let tables = [];

        if (err) throw err;
        // Napravi listu tablica iz danih rezultata
        for(let i = 0; i < result[1].length; i++) {
            tables.push(result[1][i][`Tables_in_${database.name}`])
        }

        // Kreiraj tablice skupine general ako ne postoje
        if (!tables.includes("general_razred")) {
            console.log("Kreiram tablicu general_razred");
            con.query(`
                CREATE TABLE general_razred (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    ime CHAR(10) NOT NULL,
                    smjena CHAR(1) NOT NULL
                )
            `);
        }
        if (!tables.includes("general_settings")) {
            con.query(`
                CREATE TABLE general_settings (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    option CHAR(30) NOT NULL,
                    value TEXT
                )
            `);
        }
        // Kreiraj tablice skupine izmjene ako ne postoje
        if (!tables.includes("izmjene_smjena")) {
            con.query(`
                CREATE TABLE izmjene_smjena (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    smjena CHAR(1),
                    primljena DATETIME
                )
            `);
        }
        if(!tables.includes("izmjene_tablica")) {
            con.query(`
                CREATE TABLE izmjene_tablica (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    smjena_id INT NOT NULL,
                    redni_broj INT,
                    naslov TEXT,
                    prijepodne BOOL NOT NULL
                )
            `);
        }
        if(!tables.includes("izmjene_razred")) {
            con.query(`
                CREATE TABLE izmjene_razred (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    tablica_id INT NOT NULL,
                    razred_id INT NOT NULL,
                    1sat CHAR(50),
                    2sat CHAR(50),
                    3sat CHAR(50),
                    4sat CHAR(50),
                    5sat CHAR(50),
                    6sat CHAR(50),
                    7sat CHAR(50),
                    8sat CHAR(50),
                    9sat CHAR(50)
                )
            `);
        }
        // Kreiraj tablice skupine wap ako ne postoje
        if (!tables.includes("wap_settings")) {
            con.query(`
                CREATE TABLE wap_settings (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    option CHAR(30) NOT NULL,
                    value TEXT
                )
            `);
        }
        if (!tables.includes("wap_kontakti")) {
            con.query(`
                CREATE TABLE wap_kontakti (
                    broj INT NOT NULL PRIMARY KEY,
                    razred_id INT,
                    prefix TEXT NOT NULL DEFAULT '.',
                    zadnja_poslana INT,
                    salji_izmjene BOOL NOT NULL DEFAULT false,
                    salji_sve BOOL NOT NULL DEFAULT false
                )
            `);
        }
        if (!tables.includes("wap_grupe")) {
            con.query(`
                CREATE TABLE wap_grupe (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    razred_id INT,
                    prefix TEXT NOT NULL DEFAULT '.',
                    zadnja_poslana INT,
                    salji_izmjene BOOL NOT NULL DEFAULT false,
                    salji_sve BOOL NOT NULL DEFAULT false
                )
            `);
        }
        // Kreiraj tablice skupine disc ako ne postoje
        if (!tables.includes("disc_settings")) {
            con.query(`
                CREATE TABLE disc_settings (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    option CHAR(30) NOT NULL,
                    value TEXT
                )
            `);
        }
        if (!tables.includes("disc_serveri")) {
            con.query(`
                CREATE TABLE disc_serveri (
                    server_id INT NOT NULL PRIMARY KEY,
                    prefix TEXT NOT NULL DEFAULT '.'
                )
            `);
        }
        if (!tables.includes("disc_kanali")) {
            con.query(`
                CREATE TABLE disc_kanali (
                    kanal_id INT NOT NULL PRIMARY KEY,
                    server_id INT NOT NULL,
                    razred_id INT,
                    zadnja_poslana INT,
                    salji_izmjene BOOL NOT NULL DEFAULT false,
                    salji_sve BOOL NOT NULL DEFAULT false
                )
            `);
        }
        // Kreiraj tablice skupine mail ako ne postoje
        if (!tables.includes("mail_settings")) {
            con.query(`
                CREATE TABLE mail_settings (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    option CHAR(30) NOT NULL,
                    value TEXT
                )
            `);
        }
        if (!tables.includes("mail_korisnici")) {
            con.query(`
                CREATE TABLE mail_korisnici (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    adresa char(100) NOT NULL,
                    razred_id INT,
                    unsubscribed BOOL NOT NULL DEFAULT false,
                    zadnja_poslana INT,
                    salji_sve BOOL NOT NULL DEFAULT false
                )
            `);
        }
        // Kreiraj tablice skupine panel ako ne postoje
        if (!tables.includes("panel_admins")) {
            con.query(`
                CREATE TABLE panel_admins (
                    discord_user_id INT NOT NULL PRIMARY KEY
                )
            `);
        }

    });
});

// Kreiraj funkciju za spajanje iz drugih datoteka

exports.query = (myquery, callback) => {
    con.query(myquery, (err, result, fields) => {
        callback(err, result, fields);
    });
}

// Eksportaj database config za korištenje u drugim datotekama

exports.database = database;