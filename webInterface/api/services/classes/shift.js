const db = require('../../../../databaseQueries.js');

module.exports = async (dataObject) => {
    const results = await db.dajRazredByShift(dataObject.shift);
    return results;
}