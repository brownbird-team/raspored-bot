const errors = require('./../../../../errors.js');
const dbEmail = require('./../../../../emailBot/databaseQueriesEmail.js');

module.exports = async (dataObject) => {
    if (!dataObject.token || typeof(dataObject.token) != 'string')
        throw new errors.ValidationError('Token is not defined or of invalid type');

    const userData = await dbEmail.getUser({ token: dataObject.token });

    return {
        email: userData.email,
        class: (userData.razred) ? userData.razred.ime : null,
        all: userData.saljiSve,
        theme: userData.theme,
        mute: userData.mute,
    };
}