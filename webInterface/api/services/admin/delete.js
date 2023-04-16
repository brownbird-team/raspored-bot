const db = require('../../../databaseQueriesWeb.js');
const errors = require('../../../../errors.js');

module.exports = async (dataObject) => {

    const user = await db.getUser({ id: dataObject.userId });

    if (!user)
        throw new errors.NotFoundError('Failed to delete user, user not found');

    await db.deleteUser(dataObject.userId);
}