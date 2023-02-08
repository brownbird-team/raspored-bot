const dbEmail = require('./../../../../emailBot/databaseQueriesEmail.js');
const dbPrim = require('./../../../../databaseQueries.js');
const dbWeb = require('./../../../databaseQueriesWeb.js');
const errors = require('../../../../errors.js');
const generateToken = require('../../createToken.js');
const sender = require('./../../../../emailBot/sendEmail.js');
const registerTemplate = require('./../../../../emailBot/templates/templateRegistration.js');
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
    let userData;
    userData = await dbEmail.getUser({ email: dataObject.email });

    // Ako korisnik postoji u bazi
    if (userData) {

        // Ako je korisnik verificiran vrati grešku
        if (userData.verified)
            throw new errors.RegistrationError('Unable to continue registration, account already exists');

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
    }
    
    // Kreiraj novi temp token i postavi podatke za novog korisnika
    const newTempToken = generateToken();
    let newAccount = {
        email: dataObject.email,
        verified: false,
        tempToken: newTempToken,
        tempTokenCreated: new Date(),
        tempTokenCount: (userData) ? userData.tempTokenCount + 1 : 1,
    };

    // Ako je svojstvo all postoji i ima odgovarajuću vrijednost postavi je, ako vrijednost ne valja vrati grešku
    if (typeof(dataObject.all) == 'boolean')
        newAccount.saljiSve = dataObject.all;
    else if (typeof(dataObject.all) != 'undefined')
        throw new errors.ValidationError('property all can only hold values true or false');

    // Ako je svojstvo mute postoji i ima odgovarajuću vrijednost postavi je, ako vrijednost ne valja vrati grešku
    if (typeof(dataObject.mute) == 'boolean')
        newAccount.mute = dataObject.mute;
    else if (typeof(dataObject.mute) != 'undefined')
        throw new errors.ValidationError('property mute can only hold values true or false');

    // Ako je svojstvo theme postoji i ima odgovarajuću vrijednost postavi je, ako vrijednost ne valja vrati grešku
    if (dataObject.theme === 'light' || dataObject.theme === 'dark')
        newAccount.theme = dataObject.theme;
    else if (typeof(dataObject.theme) != 'undefined')
        throw new errors.ValidationError('property theme can only hold values "light" or "dark"');

    // Ako je definirana vrijednost razreda
    if (dataObject.class) {
        // Probaj ga dobaviti
        const razredData = await dbPrim.dajRazredByName(dbPrim.prepareForSQL(dataObject.class));

        // Ako razred postoji postavi ga, ako ne vrati grešku
        if (razredData) {
            newAccount.razredId = razredData.id;
            const zadnjaIzmjena = await dbPrim.dajZadnju(razredData.id);
            newAccount.zadnjaPoslana = zadnjaIzmjena.id;
        } else {
            throw new errors.NotFoundError('Requested class does not exist');
        }
    }

    // Kreiraj korisnika ako ga nema u tablici
    if (!userData)
        await dbEmail.createUser(newAccount);
    // Ili izmjeni podatke o njemu ako ga ima ali nije verificiran
    else
        await dbEmail.updateUser({ email: newAccount.email }, newAccount);
    
    // Pošalji korisniku email sa tokenom
    await sender.send(dataObject.email, 'Registracija na Raspored Bot servis', registerTemplate({
        email: dataObject.email,
        theme: (newAccount.theme) ? newAccount.theme : 'light',
        expires: formatDate(new Date(newAccount.tempTokenCreated.getTime() + settings.tempTokenLifetime * 1000)),
        tokenUrl: (settings.tokenUrl) ? settings.tokenUrl.replaceAll('<token>', newTempToken) : ''
    }));
}