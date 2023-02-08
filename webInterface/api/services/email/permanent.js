const errors = require('./../../../../errors.js');
const dbEmail = require('./../../../../emailBot/databaseQueriesEmail.js');
const generateToken = require('./../../createToken.js');

module.exports = async (dataObject) => {
    if (!dataObject.tempToken || typeof(dataObject.tempToken) != 'string')
        throw new errors.ValidationError('Token is not defined or of invalid type');

    const newPermToken = generateToken();

    await dbEmail.updateUser({ tempToken: dataObject.tempToken }, {
        verified: true,
        token: newPermToken,
        tokenCreated: new Date(),
        tempToken: null,
        tempTokenCreated: null,
        tempTokenCount: 0,
    });

    return {
        token: newPermToken
    };
}