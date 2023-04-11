// Helper funkcije za class setove

// Dobavi klase grešaka
const errors = require('./../../errors.js');

// Provjeri postoji li dani period set
exports.classSetExists = async (con, masterId, classSetId) => {
    // Provjeri postoji li dani period set
    await con.query(`
        SELECT COUNT(*) AS classSetExists
        FROM ras_class_set
        WHERE master_id = ? AND id = ? AND delete_version IS NULL
    `, [ masterId, classSetId ]);
    // Ako ne postoji vrati grešku
    if (!con.results[0].classSetExists)
        throw new errors.ValidationError('Given class set does not exist');
}