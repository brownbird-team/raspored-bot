const db = require('../../../../databaseQueries.js');

module.exports = async () => {
    const results = await db.dajShifts();
    return results;
}