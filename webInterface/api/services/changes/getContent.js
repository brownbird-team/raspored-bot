const db = require('./../../../../databaseQueries.js');
const errors = require('./../../../../errors.js');

module.exports = async (dataObject) => {

    if (!dataObject.id)
        throw new errors.ValidationError('Change ID is not specified');

    const results = await db.getChange(dataObject.id);

    return results;
}