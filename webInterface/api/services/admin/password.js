const db = require('../../../databaseQueriesWeb.js');
const errors = require('../../../../errors.js');
const bcrypt = require('bcrypt');

const bcryptSaltRounds = 10;

module.exports = async (dataObject) => {
    
    if (typeof(dataObject.password) !== 'string')
        throw new errors.ValidationError('New password property must be string');

    const user = await db.getUser({ id: dataObject.userId });

    if (!user)
        throw new errors.NotFoundError('Failed to change user password, user not found');

    const passhash = await bcrypt.hash(dataObject.password, bcryptSaltRounds);

    await db.updateUser({
        id: dataObject.userId,
        newPassword: passhash,
    });
}