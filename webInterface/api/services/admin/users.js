const db = require('../../../databaseQueriesWeb.js');

module.exports = async () => {
    return await db.getUsers();
}