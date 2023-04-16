const db = require('../../../databaseQueriesWeb.js');
const errors = require('../../../../errors.js');

module.exports = async (dataObject) => {
    const userId = parseInt(dataObject.userId);

    if (isNaN(userId))
        throw new errors.ValidationError('Failed to delete user invalid user ID specified');

    const user = await db.getUser({ id: userId });

    if (!user)
        throw new errors.NotFoundError('Failed to delete user, user not found');

    await db.deleteUser(userId);
}