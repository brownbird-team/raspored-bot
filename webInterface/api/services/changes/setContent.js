const db = require('./../../../../databaseQueries.js');
const errors = require('./../../../../errors.js');

module.exports = async (dataObject) => {

    if (typeof(dataObject.id) !== 'number')
        throw new errors.ValidationError('Change ID must be a number');

    if (!Array.isArray(dataObject.classes))
        throw new errors.ValidationError('Classes property must be an array');

    for (const cls of dataObject.classes) {

        if (typeof(cls.classId) !== 'number')
            throw new errors.ValidationError('Class ID must be a number');

        for (let i = 1; i <= 9; i++) {
            if (typeof(cls[`sat${i}`]) !== 'string')
                throw new errors.ValidationError('Content of an hour must be string');

            if (cls[`sat${i}`].length > 50)
                throw new errors.ValidationError('Content of the hour can have maximum length of 50 characters');
        }
    }

    await db.setChange(dataObject);
}