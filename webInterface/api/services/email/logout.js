const errors = require('./../../../../errors.js');
const dbEmail = require('./../../../../emailBot/databaseQueriesEmail.js');

module.exports = async (dataObject) => {
    if (!dataObject.token || typeof(dataObject.token) != 'string')
        throw new errors.ValidationError('Token is not defined or of invalid type');

    await dbEmail.updateUser({ token: dataObject.token },{
        token: null,
        tokenCreated: null,
    });
}