const db = require('../../../databaseQueriesWeb.js');
const errors = require('../../../../errors.js');

module.exports = async (dataObject) => {
    
    if (typeof(dataObject.accessToken) !== 'string')
        throw new errors.ValidationError('Access token is not defined or of invalid type');

    const user = await db.getUser({ token: dataObject.accessToken });

    if (!user)
        throw new errors.AuthorizationError('Given token is invalid');

    return {
        userId: user.id,
        username: user.username,
    }
}