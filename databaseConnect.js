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
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    ime CHAR(10) NOT NULL,
                    smjena CHAR(1) NOT NULL,
                    aktivan BOOL DEFAULT true
                )
            `);
        }
        if (!tables.includes("general_settings")) {
            con.query(`
                CREATE TABLE general_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    option CHAR(30) NOT NULL,
                    value TEXT
                )
            `);
        }
        // Kreiraj tablice skupine izmjene ako ne postoje
        if(!tables.includes("izmjene_tablica")) {
            con.query(`
                CREATE TABLE izmjene_tablica (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    datum DATETIME NOT NULL,
                    naslov TEXT,
                    smjena CHAR(1) NOT NULL,
                    prijepodne BOOL NOT NULL,
                    INDEX (id)
                )
            `);
        }
        if (!tables.includes("izmjene_aktivne")) {
            con.query(`
                CREATE TABLE izmjene_aktivne (
                    tablica_id INT PRIMARY KEY,
                    FOREIGN KEY(tablica_id) REFERENCES izmjene_tablica(id)
                )
            `);
        }
        if(!tables.includes("izmjene_razred")) {
            con.query(`
                CREATE TABLE izmjene_razred (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    razred_id INT NOT NULL,
                    tablica_id INT NOT NULL,
                    1sat CHAR(50),
                    2sat CHAR(50),
                    3sat CHAR(50),
                    4sat CHAR(50),
                    5sat CHAR(50),
                    6sat CHAR(50),
                    7sat CHAR(50),
                    8sat CHAR(50),
                    9sat CHAR(50),
                    INDEX (id, razred_id, tablica_id),
                    FOREIGN KEY(razred_id) REFERENCES general_razred(id),
                    FOREIGN KEY(tablica_id) REFERENCES izmjene_tablica(id)
                )
            `);
        }
        // Kreiraj tablice skupine wap ako ne postoje
        if (!tables.includes("wap_settings")) {
            con.query(`
                CREATE TABLE wap_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    option CHAR(30) NOT NULL,
                    value TEXT
                )
            `);
        }
        if (!tables.includes("wap_kontakti")) {
            con.query(`
                CREATE TABLE wap_kontakti (
                    broj INT PRIMARY KEY,
                    razred_id INT,
                    prefix TEXT NOT NULL DEFAULT '.',
                    zadnja_poslana INT,
                    salji_izmjene BOOL NOT NULL DEFAULT false,
                    salji_sve BOOL NOT NULL DEFAULT false,
                    INDEX (broj),
                    FOREIGN KEY(razred_id) REFERENCES general_razred(id),
                    FOREIGN KEY(zadnja_poslana) REFERENCES izmjene_razred(id)
                )
            `);
        }
        if (!tables.includes("wap_grupe")) {
            con.query(`
                CREATE TABLE wap_grupe (
                    id INT PRIMARY KEY,
                    razred_id INT,
                    prefix TEXT NOT NULL DEFAULT '.',
                    zadnja_poslana INT,
                    salji_izmjene BOOL NOT NULL DEFAULT false,
                    salji_sve BOOL NOT NULL DEFAULT false,
                    INDEX (id),
                    FOREIGN KEY(razred_id) REFERENCES general_razred(id),
                    FOREIGN KEY(zadnja_poslana) REFERENCES izmjene_razred(id)
                )
            `);
        }
        // Kreiraj tablice skupine disc ako ne postoje
        if (!tables.includes("disc_settings")) {
            con.query(`
                CREATE TABLE disc_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    option CHAR(30) NOT NULL,
                    value TEXT
                )
            `);
        }
        if (!tables.includes("disc_serveri")) {
            con.query(`
                CREATE TABLE disc_serveri (
                    server_id INT PRIMARY KEY,
                    prefix TEXT NOT NULL DEFAULT '.',
                    INDEX (server_id)
                )
            `);
        }
        if (!tables.includes("disc_kanali")) {
            con.query(`
                CREATE TABLE disc_kanali (
                    kanal_id INT PRIMARY KEY,
                    server_id INT NOT NULL,
                    razred_id INT,
                    zadnja_poslana INT,
                    salji_izmjene BOOL NOT NULL DEFAULT false,
                    salji_sve BOOL NOT NULL DEFAULT false,
                    INDEX (kanal_id),
                    FOREIGN KEY(server_id) REFERENCES disc_serveri(server_id),
                    FOREIGN KEY(razred_id) REFERENCES general_razred(id),
                    FOREIGN KEY(zadnja_poslana) REFERENCES izmjene_razred(id)
                )
            `);
        }
        // Kreiraj tablice skupine mail ako ne postoje
        if (!tables.includes("mail_settings")) {
            con.query(`
                CREATE TABLE mail_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    option CHAR(30) NOT NULL,
                    value TEXT
                )
            `);
        }
        if (!tables.includes("mail_korisnici")) {
            con.query(`
                CREATE TABLE mail_korisnici (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    adresa char(100) NOT NULL,
                    razred_id INT,
                    unsubscribed BOOL NOT NULL DEFAULT false,
                    zadnja_poslana INT,
                    salji_sve BOOL NOT NULL DEFAULT false,
                    INDEX (adresa),
                    FOREIGN KEY(razred_id) REFERENCES general_razred(id),
                    FOREIGN KEY(zadnja_poslana) REFERENCES izmjene_razred(id)
                )
            `);
        }
        // Kreiraj tablice skupine panel ako ne postoje
        if (!tables.includes("panel_admins")) {
            con.query(`
                CREATE TABLE panel_admins (
                    discord_user_id INT PRIMARY KEY
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