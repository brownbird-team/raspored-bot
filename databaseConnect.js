// Spoji se na bazu i provjeri postojanje svih potrebnih tablica

const mysql = require("mysql");
const { configCheck, getData } = require("./loadConfig.js");
const errors = require('./errors.js');

const databaseLog = async (logThis) => {
    console.log('[\u001b[35mMySQL\033[00m] ' + logThis);
}

// Varijabla u koju je pohranjen mysql pool objekt nakon
// inicijalizacije
let pool = null;

// Funkcija vraća promise koji kreira connection prema mysql serveru
const createConnection = () => {
    return new Promise((resolve, reject) => {
        if (!pool) {
            reject(new errors.DatabaseError('Database needs to be initialized before it can be used, run databaseInit'));
            return;
        }

        pool.getConnection((err, con) => {
            if (err) {
                reject(new errors.DatabaseError('Failed to create connection on connection pool', err));
                return;
            }
            resolve(con);
        });
    });
}
exports.createConnection = createConnection;

// Funkcija vraća promise koji šalje upit mysql serveru, kao argumente
// funkciji je potrebno dati connection prema mysql serveru i string sa
// SQL upitom
const pureQuery = (connection, ...args) => {
    return new Promise((resolve, reject) => {
        connection.query(...args, (err, res) => {
            if (err) {
                reject(new errors.DatabaseError('Failed to run query on given connection', err));
                return;
            }
            resolve(res);
        });
    });
}
exports.pureQuery = pureQuery;

// Funkcija kreira connection prema mysql serveru i izvršava callback funkciju
// pri završetku ili grešci, sa argumentima error, redcima koji su rezultat upita
// i poljima
const query = (query, callback) => {
    if (!pool)
        return callback(new errors.DatabaseError('Database needs to be initialized before it can be used, run databaseInit'), null, null);

    pool.getConnection((err, con) => {
        if (err) {
            return callback(new errors.DatabaseError('Failed to create connection', err), null, null);
        } else if (con) {
            con.query(query, (err, rows, fields) => {
                con.release();
                if (err) {
                    return callback(new errors.DatabaseError('Failed to run query', err), null, null);
                }
                return callback(null, rows, fields);
            });
        } else {
            return callback(new errors.DatabaseError('No connection provided, i do not know what went wrong'), null, null);
        }
    });
}
exports.query = query;

// Funkcija vraća promise koji kreira connection prema mysql serveru i izvršava
// upit koji je dobila kao argument
const promiseQuery = (...args) => {
    return new Promise((resolve, reject) => {
        if (!pool) {
            reject(new errors.DatabaseError('Database needs to be initialized before it can be used, run databaseInit'));
            return;
        }

        pool.getConnection((err, con) => {
            if (err) {
                reject(new errors.DatabaseError('Failed to create connection for promiseQuery', err));
                return;
            }

            con.query(...args, (err, rows, fields) => {
                con.release();
                if (err) {
                    reject(new errors.DatabaseError('Failed to run promiseQuery', err));
                    return;
                }

                resolve(rows);
            });
        });
    });
}
exports.promiseQuery = promiseQuery;

// Kreira connection pool i provjerava postojanje nužnih tablica u bazi, te
// ih kreira po potrebi
exports.databaseInit = async () => {
    // Dobavi konfiguraciju za bazu
    const database = getData().database;

    // Kreiraj connection pool
    pool = mysql.createPool({
        connectionLimit    : database.connectionLimit,
        host               : database.host,
        port               : database.port,
        user               : database.user,
        password           : database.password,
        database           : database.name,
        debug              : false,
        multipleStatements : true
    });
    databaseLog(`Connecting to database ${database.name} - ${database.host}:${database.port}`);

    // Provjeri postoje li sve potrebne tablice
    const con = await createConnection();
    databaseLog("Starting database tables check");
    
    // Zatraži listu svih tablica u bazi
    const result = await pureQuery(con, `USE ${database.name}; SHOW TABLES`);

    let tables = [];

    // Napravi listu tablica iz danih rezultata
    for(let i = 0; i < result[1].length; i++) {
        tables.push(result[1][i][`Tables_in_${database.name}`])
    }

    // Kreiraj tablice skupine general ako ne postoje
    if (!tables.includes("general_razred")) {
        databaseLog("Creating database table general_razred");
        await pureQuery(con, `
            CREATE TABLE general_razred (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ime VARCHAR(128) NOT NULL,
                smjena VARCHAR(128) NOT NULL,
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
                ('4.G', 'B'), ('4.E', 'B'), ('4.M', 'B'), ('4.N', 'B');
        `);
    }
    // Kreiraj tablice skupine izmjene ako ne postoje
    if (!tables.includes("izmjene_settings")) {
        databaseLog("Creating database table izmjene_settings");
        await pureQuery(con, `
            CREATE TABLE izmjene_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                option VARCHAR(30) NOT NULL,
                value TEXT
            )
        `);
    }
    if(!tables.includes("izmjene_tablica")) {
        databaseLog("Creating database table izmjene_tablica");
        await pureQuery(con, `
            CREATE TABLE izmjene_tablica (
                id INT AUTO_INCREMENT PRIMARY KEY,
                naslov TEXT,
                smjena VARCHAR(128) NOT NULL,
                prijepodne BOOL NOT NULL,
                INDEX (id)
            )
        `);
    }
    if(!tables.includes("izmjene_razred")) {
        databaseLog("Creating database table izmjene_razred");
        await pureQuery(con, `
            CREATE TABLE izmjene_razred (
                id INT AUTO_INCREMENT PRIMARY KEY,
                razred_id INT NOT NULL,
                tablica_id INT NOT NULL,
                datum DATETIME NOT NULL,
                sat1 VARCHAR(50),
                sat2 VARCHAR(50),
                sat3 VARCHAR(50),
                sat4 VARCHAR(50),
                sat5 VARCHAR(50),
                sat6 VARCHAR(50),
                sat7 VARCHAR(50),
                sat8 VARCHAR(50),
                sat9 VARCHAR(50),
                INDEX (id, razred_id, tablica_id),
                FOREIGN KEY(razred_id) REFERENCES general_razred(id),
                FOREIGN KEY(tablica_id) REFERENCES izmjene_tablica(id)
            )
        `);
    }
    // Kreiraj tablice skupine disc ako ne postoje
    if (!tables.includes("disc_settings")) {
        databaseLog("Creating database table disc_settings");
        await pureQuery(con, `
            CREATE TABLE disc_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                option VARCHAR(30) NOT NULL UNIQUE,
                value TEXT
            )
        `);
    }
    if (!tables.includes("disc_serveri")) {
        databaseLog("Creating database table disc_serveri");
        await pureQuery(con, `
            CREATE TABLE disc_serveri (
                server_id VARCHAR(50) PRIMARY KEY,
                prefix TEXT,
                razred_id INT,
                INDEX (server_id),
                FOREIGN KEY(razred_id) REFERENCES general_razred(id)
            )
        `);
    }
    if (!tables.includes("disc_kanali")) {
        databaseLog("Creating database table disc_kanali");
        await pureQuery(con, `
            CREATE TABLE disc_kanali (
                kanal_id VARCHAR(50) PRIMARY KEY,
                server_id VARCHAR(50),
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
        `);
    }
    // Kreiraj tablice skupine email ako ne postoje
    if (!tables.includes("email_settings")) {
        databaseLog("Creating database table email_settings");
        await pureQuery(con, `
            CREATE TABLE email_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                option VARCHAR(30) NOT NULL UNIQUE,
                value TEXT
            )
        `);
    }
    if (!tables.includes("email_korisnici")) {
        databaseLog("Creating database table email_korisnici");
        await pureQuery(con, `
            CREATE TABLE email_korisnici (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                verified BOOL NOT NULL DEFAULT false,
                razred_id INT,
                zadnja_poslana INT,
                salji_sve BOOL NOT NULL DEFAULT false,
                salji_izmjene BOOL NOT NULL DEFAULT true,
                web_theme VARCHAR(15) NOT NULL DEFAULT 'light',
                web_token VARCHAR(100) UNIQUE,
                web_token_created DATETIME,
                temp_token VARCHAR(100) UNIQUE,
                temp_token_created DATETIME,
                temp_token_count INT NOT NULL DEFAULT 0,
                INDEX (email),
                FOREIGN KEY(razred_id) REFERENCES general_razred(id),
                FOREIGN KEY(zadnja_poslana) REFERENCES izmjene_razred(id)
            )
        `);
    }
    // Kreiraj tablice skupine web ako ne postoje
    if (!tables.includes("web_settings")) {
        databaseLog("Creating database table web_settings");
        await pureQuery(con, `
            CREATE TABLE web_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                option VARCHAR(30) NOT NULL UNIQUE,
                value TEXT
            )
        `);
    }
    if (!tables.includes("web_admin")) {
        databaseLog("Creating database table web_admin");
        await pureQuery(con, `
            CREATE TABLE web_admin (
                id INT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(128) UNIQUE,
                password VARCHAR(256),
                web_token VARCHAR(128) UNIQUE,
                web_token_created DATETIME
            )
        `);
        databaseLog('Adding default admin user with username "admin" and password "admin"');
        databaseLog('');
        databaseLog('  +-------------------------------------------------------+');
        databaseLog('  |    Be sure to change password for default user !!!    |');
        databaseLog('  +-------------------------------------------------------+');
        databaseLog('');
        await pureQuery(
            con, 'INSERT INTO web_admin (username, password) VALUES ?',
            [[[ 'admin', '$2b$10$JwyHfQBv0NK2TlUIuIeTe.l.SFqCNfWxxdQP6UnnVLVuWhONYMxY6' ]]]
        );
    }

    return true;
}