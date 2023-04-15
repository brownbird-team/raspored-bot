// Helper funkcije za upravljanje verzijama master tablica

// Dobavi klase grešaka
const errors = require('./../../errors.js');

// Kreiraj novu verziju dane master tablice
exports.getVersion = async (con, masterId) => {
    await con.query('INSERT INTO ras_master_version SET master_id = ?', [ masterId ]);
    return con.results.insertId;
}

exports.getCurrentVersion = async (con, masterId) => {
    await con.query('SELECT MAX(version) AS version FROM ras_master_version WHERE master_id = ?', [ masterId ]);
    return con.results[0].version;
}

// Provjeri postoji li tablica sa danim master IDjem ili ako master ID
// nije definiran dobavi ID trenutne master tablice
exports.getId = async (con, masterId) => {
    // Ako je definirano za koju master tablicu treba kreirati set
    if (masterId) {
        const res = await con.query('SELECT COUNT(*) AS master_exists FROM ras_master_table WHERE id = ?', [ masterId ]);
        // Ako ta tablica ne postoji baci grešku
        if (!res[0].master_exists)
            throw new errors.ValidationError('There is no master table with specified ID');
    // Ako master ID nije definiran koristi ID najnovije tablice
    } else {
        const res = await con.query('SELECT MAX(id) AS id FROM ras_master_table');
        masterId = res[0].id;
    }
    return masterId;
}