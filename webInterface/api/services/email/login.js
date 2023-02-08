const dbEmail = require('./../../../../emailBot/databaseQueriesEmail.js');
const dbWeb = require('./../../../databaseQueriesWeb.js');
const errors = require('../../../../errors.js');
const generateToken = require('../../createToken.js');
const sender = require('./../../../../emailBot/sendEmail.js');
const loginTemplate = require('./../../../../emailBot/templates/templateLogin.js');
const { formatDate, emailValid } = require('./../../../helperFunctionsWeb.js');

module.exports = async (dataObject) => {
    // Objekt koji sadrži potrebne postavke iz baze
    let settings = {};

    // Dobavi postavke iz baze
    settings.tokenUrl = await dbEmail.getOption('tokenUrl');
    settings.tempTokenLifetime = await dbWeb.getOption('tempTokenLifetime')
    settings.maxTempTokens = await dbEmail.getOption('maxTempTokens')

    // Pretvori stringove u number gdje je potrebno
    settings.tempTokenLifetime = Number.parseInt(settings.tempTokenLifetime);
    settings.maxTempTokens = Number.parseInt(settings.maxTempTokens);
    if (settings.tempTokenLifetime === NaN || settings.maxTempTokens === NaN)
        throw new errors.DatabaseError('Failed to parse settings from database to int');
    
    // Ako email nije definiran vrati grešku
    if (!dataObject.email)
        throw new errors.ValidationError('Registration email is not defined');

    // Ako email ne odgovara email regexu vrati grešku
    if (!emailValid(dataObject.email))
        throw new errors.ValidationError('Provided email address is not valid');

    // Dovabi podatke korisnika iz baze za dani email
    const userData = await dbEmail.getUser({ email: dataObject.email });

    if (!userData || !userData.verified)
        throw new errors.NotFoundError('Account does not exist')

    // Ako je korisnik napravio previše temp tokena
    if (userData.tempToken && userData.tempTokenCount >= settings.maxTempTokens) {
        // Ms kada temp token ističe
        const tempTokenExpires = userData.tempTokenCreated.getTime() + settings.tempTokenLifetime * 1000;

        // Ako je zadnji kreirani token istekao postavi njegov brojač tokena na 0
        if (tempTokenExpires < Date.now())
            userData.tempTokenCount = 0;
        // Ako zadnji token nije istekao vrati grešku
        else if (tempTokenExpires > Date.now())
            throw new errors.TooManyAttemptsError('You have created maximum number of temp tokens, please use last generated token or wait for it to expire before requesting new one')    
    }
    
    // Kreiraj novi temp token i postavi podatke za korisnika
    const newTempToken = generateToken();
    let updateAccount = {
        tempToken: newTempToken,
        tempTokenCreated: new Date(),
        tempTokenCount: (userData) ? userData.tempTokenCount + 1 : 1,
    };

    // Izmjeni podatke korisnika
    await dbEmail.updateUser({ email: userData.email }, updateAccount);
    
    // Pošalji korisniku email sa tokenom
    await sender.send(userData.email, 'Prijava na Raspored Bot Panel', loginTemplate({
        email: userData.email,
        theme: (userData.theme) ? userData.theme : 'light',
        expires: formatDate(new Date(updateAccount.tempTokenCreated.getTime() + settings.tempTokenLifetime * 1000)),
        tokenUrl: (settings.tokenUrl) ? settings.tokenUrl.replaceAll('<token>', newTempToken) : ''
    }));
}