const db = require('./../../../../databaseQueries.js');
const errors = require('./../../../../errors.js');

module.exports = async (dataObject) => {

    if (typeof(dataObject.heading) !== 'string' || typeof(dataObject.shift) !== 'string' || typeof(dataObject.morning) !== 'boolean')
        throw new errors.ValidationError('One of needed parametars is missing or of invalid type');

    if (dataObject.shift.length > 128)
        throw new errors.ValidationError('There can be only 128 characters in shift name');

    const newId = await db.insertChangeTable(dataObject);

    return newId;
}