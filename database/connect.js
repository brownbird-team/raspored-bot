// Spoji se na bazu i provjeri postojanje svih potrebnih tablica

const fs = require('fs');

const mysql = require("mysql");
const { configCheck, getData } = require("../loadConfig.js");
const errors = require('../errors.js');

// Ispis u konzolu s prefixom [database]
const databaseLog = async (logThis) => {
    console.log('[\u001b[35mMySQL\033[00m] ' + logThis);
}

// Varijabla u koju je pohranjen mysql pool objekt nakon
// inicijalizacije
let pool = null;

// Klasa Connection služi za povezivanje s bazom podataka i izvršavanje
// upita prema bazi
class Connection {

    // Postavi sve varijable objekta na null
    constructor() {
        this.fields = null;
        this.results = null;
        this.connection = null;
    }

    // Spoji se na bazu (kreiraj connection)
    connect() {
        return new Promise((resolve, reject) => {
            // Ako pool nije aktivan javi grešku
            if (!pool) {
                reject(new errors.DatabaseError('Database needs to be initialized before it can be used, run databaseInit'));
                return;
            }
            // Ako je ovaj connection već kreiran javi grešku
            if (this.connection) {
                reject(new errors.DatabaseError('This connection is already connected, release it before reconnecting it'));
                return
            }
            // Inaće zatraži connection
            pool.getConnection((err, con) => {
                if (err) {
                    reject(new errors.DatabaseError('Failed to create connection on connection pool', err));
                    return;
                }
                this.connection = con;
                resolve(con);
            });
        });
    }

    // Izvrši neki query
    query(...args) {
        return new Promise((resolve, reject) => {
            // Ako veza sa bazom nije ostvarena vrati grešku
            if (!this.connection) {
                reject(new errors.DatabaseError('Cannot execute query, connection is not created'));
                return;
            }
            // Izvrši query
            this.connection.query(...args, (err, results, fields) => {
                // Ako je došlo do greške baci grešku
                if (err) {
                    reject(new errors.DatabaseError('Failed to run database query', err));
                    return;
                }
                // Pohrani polja i rezultate u objekt
                this.fields = fields;
                this.results = results;
                // Vrati rezultate
                resolve(results);
            });
        });
    }

    // Kreiraj transakciju
    transaction() {
        return new Promise((resolve, reject) => {
            // Ako veza sa bazom nije ostvarena vrati grešku
            if (!this.connection) {
                reject(new errors.DatabaseError('Cannot create transaction, connection is not created'));
                return;
            }
            // Kreiraj transakciju
            this.connection.beginTransaction((err) => {
                // Provjeri je li transakcija uspješno kreirana
                if (err) {
                    reject(new errors.DatabaseError('Failed to create transaction', err));
                    return
                }
                resolve();
            });
        });
    }

    // Napravi rollback (za transakcije)
    rollback() {
        return new Promise((resolve, reject) => {
            // Ako veza sa bazom nije ostvarena vrati grešku
            if (!this.connection) {
                reject(new errors.DatabaseError('Cannot make a rollback, connection is not created'));
                return;
            }
            // Napravi rollback
            this.connection.rollback(() => {
                resolve();
            });
        });
    }

    // Napravi commit (za transakcije)
    commit() {
        return new Promise((resolve, reject) => {
            // Ako veza sa bazom nije ostvarena vrati grešku
            if (!this.connection) {
                reject(new errors.DatabaseError('Cannot commit, connection is not created'));
                return;
            }
            // Napravi commit
            this.connection.commit((err) => {
                if (err) {
                    reject(new errors.DatabaseError('Failed to commit, this could be a problem', err));
                    return;
                }
            });
        });
    }

    // Otpusti ovaj connection (odspoji se)
    release() {
        if (this.connection) {
            this.connection.release();
            this.connection = null;
        }
    }

    // Napravi ping prema serveru
    ping() {
        return new Promise((resolve, reject) => {
            // Ako veza sa bazom nije ostvarena vrati grešku
            if (!this.connection) {
                reject(new errors.DatabaseError('Cannot ping server, connection is not created'));
                return;
            }
            this.connection.ping((err) => {
                if (err) {
                    reject(new errors.DatabaseError('Failed to ping the server', err));
                    return;
                }
                resolve();
            });
        });
    }

    // Ispiši nešto u konzolu kao database
    static log(logThis) {
        databaseLog(logThis);
    }

    // Statična funkcija za izvršavanje upita, automatski kreira connection
    // otpušta ga nakon izvršavanja upita
    static query(...args) {
        return new Promise((resolve, reject) => {
            // Ako pool nije aktivan javi grešku
            if (!pool) {
                reject(new errors.DatabaseError('Database needs to be initialized before it can be used, run databaseInit'));
                return;
            }
            // Zatraži connection
            pool.getConnection((err, con) => {
                if (err) {
                    reject(new errors.DatabaseError('Failed to create connection on connection pool', err));
                    return;
                }
                // Izvrši query
                con.query(...args, (err, results, fields) => {
                    // Otpusti connection
                    con.release();
                    // Ako je došlo do greške baci grešku
                    if (err) {
                        reject(new errors.DatabaseError('Failed to run database query', err));
                        return;
                    }
                    // Ako je sve prošlo OK vrati rezultate
                    resolve(results);
                });
            });
        });
    }
}

// Kreira connection pool i provjerava postojanje nužnih tablica u bazi, te
// ih kreira po potrebi
const databaseInit = async () => {
    return new Promise((resolve, reject) => {
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

        // Spoji se na bazu
        pool.getConnection((err, con) => {
            if (err) {
                reject(new errors.DatabaseError('Failed to create connection on connection pool', err));
                return;
            }

            databaseLog("Running database initialization queries");
            
            // Nabavi listu file-ova sa inicijalizacijskim upitima
            let initQuery = '';
            const files = fs.readdirSync(__dirname + '/databaseInitQueries');

            // Spoji sve inicijalizacijske upite
            files.forEach((file) => {
                initQuery += fs.readFileSync(__dirname + '/databaseInitQueries/' + file);
            });

            con.query(initQuery, (err, results, fields) => {
                if (err) {
                    reject(new errors.DatabaseError('Failed to run database initialization queries', err));
                    return;
                }
                // Sve je prošlo OK
                resolve();
            });
        });
    });
}

// Exportaj stvari
module.exports = { databaseInit, Connection };