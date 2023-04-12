const db = require('../connect');

// Dobivanje id-a zadnjeg master tablea
exports.getLastMasterId = async () =>{

    let query = `SELECT MAX(id) AS id FROM ras_master_table`;

    let result = await db.Connection.query(query);

    return result[0].id;

}