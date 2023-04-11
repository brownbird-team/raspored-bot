// Helper funkcije za period setove

// Dobavi klase grešaka
const errors = require('./../../errors.js');

// Provjeri postoji li dani period set
exports.periodSetExists = async (con, masterId, periodSetId) => {
    // Provjeri postoji li dani period set
    await con.query(`
        SELECT COUNT(*) AS periodSetExists
        FROM ras_period_set
        WHERE master_id = ? AND id = ? AND delete_version IS NULL
    `, [ masterId, periodSetId ]);
    // Ako ne postoji vrati grešku
    if (!con.results[0].periodSetExists)
        throw new errors.ValidationError('Given period set does not exist');
}
