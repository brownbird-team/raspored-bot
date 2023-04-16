const db = require('../../../databaseQueriesWeb.js');
const errors = require('../../../../errors.js');

module.exports = async (dataObject) => {
    
    if (typeof(dataObject.accessToken) !== 'string')
        throw new errors.ValidationError('Access token is not defined or of invalid type');

    await db.updateUser({
        token: dataObject.accessToken,
        newToken: null,
        newTokenCreated: null,
    });
}
