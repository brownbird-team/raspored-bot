// Spoji se na bazu i provjeri postojanje svih potrebnih tablica

const mysql = require("mysql");
const { configCheck, getData } = require("./loadConfig.js");

configCheck();
const database = getData().database;

const databaseLog = async (logThis) => {
    console.log('[\u001b[35mMySQL\033[00m] ' + logThis);
}

const throwError = (err) => {
    if (err) throw err;
}

const pool = mysql.createPool({
    connectionLimit    : database.connectionLimit,
    host               : database.host,
    port               : database.port,
    user               : database.user,
    password           : database.password,
    database           : database.name,
    debug              : false,
    multipleStatements : true
});

// Spoji se na bazu
pool.getConnection((err, con) => {
    if (err) throw err;
    databaseLog(`Uspješno spajanje na bazu ${database.name} - ${database.host}:${database.port}`);

    // Zatraži listu svih tablica u bazi
    con.query(`USE ${database.name}; SHOW TABLES`, (err, result, fields) => {
        let tables = [];

        throwError(err);
        // Napravi listu tablica iz danih rezultata
        for(let i = 0; i < result[1].length; i++) {
            tables.push(result[1][i][`Tables_in_${database.name}`])
        }

        // Kreiraj tablice skupine general ako ne postoje
        if (!tables.includes("general_razred")) {
            databaseLog("Kreiram tablicu general_razred");
            con.query(`
                CREATE TABLE general_razred (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    ime CHAR(10) NOT NULL,
                    smjena CHAR(1) NOT NULL,
                    aktivan BOOL NOT NULL DEFAULT true
                );
                INSERT INTO general_razred (ime, smjena) VALUES
                    ('1.A', 'A'), ('1.B', 'A'), ('1.C', 'A'), ('1.D', 'A'),
                    ('1.O', 'A'), ('2.A', 'A'), ('2.B', 'A'), ('2.C', 'A'),
                    ('2.D', 'A'), ('2.O', 'A'), ('3.A', 'A'), ('3.B', 'A'),
                    ('3.C', 'A'), ('3.D', 'A'), ('3.O', 'A'), ('4.A', 'A'),
                    ('4.B', 'A'), ('4.C', 'A'), ('4.D', 'A'), ('4.O', 'A'),
                    ('1.E', 'B'), ('1.F', 'B'), ('1.G', 'B'), ('1.M', 'B'),
                    ('1.N', 'B'), ('2.E', 'B'), ('2.F', 'B'), ('2.G', 'B'),
                    ('2.M', 'B'), ('2.N', 'B'), ('3.E', 'B'), ('3.F', 'B'),
                    ('3.G', 'B'), ('3.M', 'B'), ('3.N', 'B'), ('4.F', 'B'),
                    ('4.G', 'B'), ('4.H', 'B'), ('4.M', 'B'), ('4.N', 'B');
            `);
        }
        if (!tables.includes("general_settings")) {
            databaseLog("Kreiram tablicu general_settings");
            con.query(`
                CREATE TABLE general_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    option CHAR(30) NOT NULL,
                    value TEXT
                )
            `, throwError);
        }
        if (!tables.includes("izmjene_settings")) {
            databaseLog("Kreiram tablicu izmjene_settings");
            con.query(`
                CREATE TABLE izmjene_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    option CHAR(30) NOT NULL,
                    value TEXT
                )
            `, throwError);
        }
        // Kreiraj tablice skupine izmjene ako ne postoje
        if(!tables.includes("izmjene_tablica")) {
            databaseLog("Kreiram tablicu izmjene_tablica");
            con.query(`
                CREATE TABLE izmjene_tablica (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    naslov TEXT,
                    smjena CHAR(1) NOT NULL,
                    prijepodne BOOL NOT NULL,
                    INDEX (id)
                )
            `, throwError);
        }
        if(!tables.includes("izmjene_razred")) {
            databaseLog("Kreiram tablicu izmjene_razred");
            con.query(`
                CREATE TABLE izmjene_razred (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    razred_id INT NOT NULL,
                    tablica_id INT NOT NULL,
                    datum DATETIME NOT NULL,
                    sat1 CHAR(50),
                    sat2 CHAR(50),
                    sat3 CHAR(50),
                    sat4 CHAR(50),
                    sat5 CHAR(50),
                    sat6 CHAR(50),
                    sat7 CHAR(50),
                    sat8 CHAR(50),
                    sat9 CHAR(50),
                    INDEX (id, razred_id, tablica_id),
                    FOREIGN KEY(razred_id) REFERENCES general_razred(id),
                    FOREIGN KEY(tablica_id) REFERENCES izmjene_tablica(id)
                )
            `, throwError);
        }
        // Kreiraj tablice skupine wap ako ne postoje
        if (!tables.includes("wap_settings")) {
            databaseLog("Kreiram tablicu wap_settings");
            con.query(`
                CREATE TABLE wap_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    option CHAR(30) NOT NULL,
                    value TEXT
                )
            `, throwError);
        }
        if (!tables.includes("wap_kontakti")) {
            databaseLog("Kreiram tablicu wap_kontakti");
            con.query(`
                CREATE TABLE wap_kontakti (
                    broj CHAR(50) PRIMARY KEY,
                    razred_id INT,
                    prefix TEXT NOT NULL DEFAULT '.',
                    zadnja_poslana INT,
                    salji_izmjene BOOL NOT NULL DEFAULT false,
                    salji_sve BOOL NOT NULL DEFAULT false,
                    INDEX (broj),
                    FOREIGN KEY(razred_id) REFERENCES general_razred(id),
                    FOREIGN KEY(zadnja_poslana) REFERENCES izmjene_razred(id)
                )
            `, throwError);
        }
        if (!tables.includes("wap_grupe")) {
            databaseLog("Kreiram tablicu wap_grupe");
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
            `, throwError);
        }
        // Kreiraj tablice skupine disc ako ne postoje
        if (!tables.includes("disc_settings")) {
            databaseLog("Kreiram tablicu disc_settings");
            con.query(`
                CREATE TABLE disc_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    option CHAR(30) NOT NULL UNIQUE,
                    value TEXT
                )
            `, throwError);
        }
        if (!tables.includes("disc_serveri")) {
            databaseLog("Kreiram tablicu disc_serveri");
            con.query(`
                CREATE TABLE disc_serveri (
                    server_id BIGINT PRIMARY KEY,
                    prefix TEXT,
                    razred_id INT,
                    INDEX (server_id),
                    FOREIGN KEY(razred_id) REFERENCES general_razred(id)
                )
            `, throwError);
        }
        if (!tables.includes("disc_kanali")) {
            databaseLog("Kreiram tablicu disc_kanali");
            con.query(`
                CREATE TABLE disc_kanali (
                    kanal_id BIGINT PRIMARY KEY,
                    server_id BIGINT,
                    prefix TEXT,
                    razred_id INT,
                    zadnja_poslana INT,
                    salji_izmjene BOOL NOT NULL DEFAULT true,
                    salji_sve BOOL NOT NULL DEFAULT false,
                    INDEX (kanal_id),
                    FOREIGN KEY(server_id) REFERENCES disc_serveri(server_id),
                    FOREIGN KEY(razred_id) REFERENCES general_razred(id),
                    FOREIGN KEY(zadnja_poslana) REFERENCES izmjene_razred(id)
                )
            `, throwError);
        }
        // Kreiraj tablice skupine mail ako ne postoje
        if (!tables.includes("mail_settings")) {
            databaseLog("Kreiram tablicu mail_settings");
            con.query(`
                CREATE TABLE mail_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    option CHAR(30) NOT NULL,
                    value TEXT
                )
            `, throwError);
        }
        if (!tables.includes("mail_korisnici")) {
            databaseLog("Kreiram tablicu mail_korisnici");
            con.query(`
                CREATE TABLE mail_korisnici (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    adresa char(100) NOT NULL,
                    razred_id INT,
                    unsubscribed BOOL NOT NULL DEFAULT false,
                    token TEXT NOT NULL,
                    zadnji_token DATETIME NOT NULL,
                    zadnja_poslana INT,
                    salji_sve BOOL NOT NULL DEFAULT false,
                    tamna_tema BOOL NOT NULL DEFAULT false,
                    dobrodoslica BOOL NOT NULL DEFAULT true,
                    INDEX (adresa),
                    FOREIGN KEY(razred_id) REFERENCES general_razred(id),
                    FOREIGN KEY(zadnja_poslana) REFERENCES izmjene_razred(id)
                )
            `, throwError);
        }
        // Kreiraj tablice skupine panel ako ne postoje
        if (!tables.includes("panel_admins")) {
            databaseLog("Kreiram tablicu panel_admins");
            con.query(`
                CREATE TABLE panel_admins (
                    discord_user_id INT PRIMARY KEY
                )
            `, throwError);
        }
    });
});

// Kreiraj funkciju za spajanje iz drugih datoteka
exports.query = (query, callback) => {
    pool.getConnection((err, con) => {
        if (err) {
            return callback(err, null, null)
        } else if (con) {
            con.query(query, (err, rows, fields) => {
                con.release();
                if(err) {
                    return callback(err, null, null);
                }
                return callback(null, rows, fields);
            });
        } else {
            return callback("No connection", null, null);
        }
    });
}

// Kreiraj funkciju koja vraća Promise za napravit Query iz baze
exports.promiseQuery = (query) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if(err) throw err;

            con.query(query, (err, rows, fields) => {
                con.release();
                if(err) throw err;

                resolve(rows);
            });
        });
    });
}

// Eksportaj database config za korištenje u drugim datotekama
exports.database = database;