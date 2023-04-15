const errors = require('./../../../../errors.js');
const dbEmail = require('./../../../../emailBot/databaseQueriesEmail.js');
const sender = require('./../../../../emailBot/sendEmail.js');
const goodbyeTemplate = require('./../../../../emailBot/templates/templateGoodBye.js');

module.exports = async (dataObject) => {
    if (!dataObject.token || typeof(dataObject.token) != 'string')
        throw new errors.ValidationError('Token is not defined or of invalid type');

    const user = await dbEmail.getUser({ token: dataObject.token });

    if (user) {
        sender.send(user.email, 'Uspješno ste prekinuli pretplatu', goodbyeTemplate({
            email: user.email,
            theme: user.theme,
        }));
    }

    await dbEmail.deleteUser({
        token: dataObject.token
    });
}