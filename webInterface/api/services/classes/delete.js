const db = require('../../../../databaseQueries.js');

module.exports = async (dataObject) => {
    await db.deleteRazred(dataObject.id);
}