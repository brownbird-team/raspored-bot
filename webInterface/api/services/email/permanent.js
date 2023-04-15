const errors = require('./../../../../errors.js');
const dbEmail = require('./../../../../emailBot/databaseQueriesEmail.js');
const sender = require('./../../../../emailBot/sendEmail.js');
const welcomeTemplate = require('./../../../../emailBot/templates/templateWelcome.js');
const generateToken = require('./../../createToken.js');

module.exports = async (dataObject) => {
    if (!dataObject.tempToken || typeof(dataObject.tempToken) != 'string')
        throw new errors.ValidationError('Token is not defined or of invalid type');

    const newPermToken = generateToken();

    const user = await dbEmail.getUser({ tempToken: dataObject.tempToken });

    if (user && user.verified === false) {
        sender.send(user.email, 'Hvala što koristite Raspored Bota', welcomeTemplate({
            email: user.email,
            theme: user.theme,
            supportMail: await dbEmail.getOption('supportEmail')
        }));
    }

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