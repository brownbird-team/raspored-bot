const db = require('./../../../../databaseQueries.js');

module.exports = async () => {
    const results = await db.getChangeTables();
    return results;
}