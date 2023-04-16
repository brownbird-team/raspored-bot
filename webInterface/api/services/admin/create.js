const db = require('../../../databaseQueriesWeb.js');
const errors = require('../../../../errors.js');
const bcrypt = require('bcrypt');

const bcryptSaltRounds = 10;

module.exports = async (dataObject) => {

    if (typeof(dataObject.username) !== 'string' || typeof(dataObject.password) !== 'string')
        throw new errors.ValidationError('Username and password must be of type string');

    const user = await db.getUser({
        username: dataObject.username,
    });

    if (user)
        throw new errors.ConflictError('Failed to created user, user already exists');

    const passhash =  await bcrypt.hash(dataObject.password, bcryptSaltRounds);

    await db.createUser({
        username: dataObject.username,
        password: passhash
    });
}