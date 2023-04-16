const db = require('../../../databaseQueriesWeb.js');
const errors = require('../../../../errors.js');
const bcrypt = require('bcrypt');
const tokenGen = require('../../createToken.js');

module.exports = async (dataObject) => {

    if (typeof(dataObject.username) !== 'string' || typeof(dataObject.password) !== 'string')
        throw new errors.ValidationError('You must specify both username and password');

    const user = await db.getUser({ username: dataObject.username });

    if (!user)
        throw new errors.AuthorizationError('Access denied, username or password is incorrent');

    const passwordOk = await bcrypt.compare(dataObject.password, user.password);

    if (!passwordOk)
        throw new errors.AuthorizationError('Access denied, username or password is incorrent');

    const token = tokenGen();
    await db.updateUser({
        username: dataObject.username,
        newToken: token,
        newTokenCreated: (new Date()),
    });

    return { token: token };
}