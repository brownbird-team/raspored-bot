// Spoji se na bazu i provjeri postojanje svih potrebnih tablica

const fs = require('fs');

const mysql = require("mysql");
const { configCheck, getData } = require("../loadConfig.js");
const errors = require('../errors.js');

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
const pureQuery = (connection, query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, res) => {
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
const promiseQuery = (query) => {
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

            con.query(query, (err, rows, fields) => {
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
    databaseLog("Running database initialization queries");
    
    // Nabavi listu file-ova sa inicijalizacijskim upitima
    let initQuery = '';
    const files = fs.readdirSync(__dirname + '/databaseInitQueries');

    // Spoji sve inicijalizacijske upite
    files.forEach((file) => {
        initQuery += fs.readFileSync(__dirname + '/databaseInitQueries/' + file);
    });

    //let initQuery = `DELIMITER $$`;

    // Pokreni inicijalizaciju (kreiraj sve što treba ako ne postoji)
    pureQuery(con, initQuery);

    return true;
}