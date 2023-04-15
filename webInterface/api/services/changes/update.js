const db = require('./../../../../databaseQueries.js');
const errors = require('./../../../../errors.js');

module.exports = async (dataObject) => {

    if (typeof(dataObject.shift) === 'string' && dataObject.shift.length > 128)
        throw new errors.ValidationError('There can be only 128 characters in shift name');

    await db.updateChangeTable(dataObject);
}