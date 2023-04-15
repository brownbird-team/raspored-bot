const db = require('../../../../databaseQueries.js');
const errors = require('../../../../errors.js');

module.exports = async (dataObject) => {
    // Provjeri jesu li ime i smjena definirani
    if (typeof(dataObject.name) !== 'string' || typeof(dataObject.shift) !== 'string')
        throw new errors.ValidationError('Failed to create class, invalid properties');

    // Makni sve bjeline iz imena
    dataObject.name = dataObject.name.replace(/\s/g, '');
    dataObject.shift = dataObject.shift.replace(/\s/g, '');

    // Kreiraj razred
    const newId = await db.insertRazred({
        name: dataObject.name,
        shift: dataObject.shift
    });

    return newId;
}