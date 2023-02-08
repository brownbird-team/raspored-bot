const errors = require('./../../../errors.js');
const dbEmail = require('./../../../emailBot/databaseQueriesEmail.js');
const dbWeb = require('./../../databaseQueriesWeb.js');

exports.permTokenAuth = async (req, res, next) => {
    try {
        // Izvadi authorization header is requesta
        const authorizationHeader = req.get('Authorization');
        // Ako header nije definiran vrati grešku
        if (!authorizationHeader || authorizationHeader === '')
            throw new errors.AuthorizationError('Unauthorized, authorization token not provided');
        // Izvadi djelove headera
        const authType =  authorizationHeader.split(' ')[0];
        const authToken = authorizationHeader.split(' ')[1];
        // Provjeri koristi li se odgovarajući tip autorizacije
        if (authType.toLowerCase() !== 'bearer')
            throw new errors.AuthorizationError('Unauthorized, authorization scheme not supported')
        // Provjeri je token definiran
        if (typeof(authToken) !== 'string')
            throw new errors.AuthorizationError('Unauthorized, authorization token not provided');

        // Probaj dobaviti podatke o korisniku za ovaj token
        const userData = await dbEmail.getUser({ token: authToken });
        // Ako korisnik nije nađen ili korisnik nije verificiran (nemoguće) autorizacija je neuspješna
        if (!userData || !userData.verified)
            throw new errors.AuthorizationError('Unauthorized, provoded authorization token is not valid');
        // Ako ne postoji zapis o tome kad je token napravljen to je jako čudno
        if (!userData.tokenCreated)
            throw new errors.InternalServerError('Token is valid, but server has no clue when was this token created');

        // Dobavi koliko vijedi perm token
        const permTokenLifetime = Number.parseInt(await dbWeb.getOption('permTokenLifetime'));
        // Ako vrijednost postavke nije broj neko od admina je neš zaribo
        if (isNaN(permTokenLifetime))
            throw new errors.DatabaseError('Failed to parse settings from database to int');
        // Provjeri ako je sada kasnije od kada token ističe token je istekao
        if (userData.tokenCreated.getTime() + permTokenLifetime * 1000 <= Date.now())
            throw new errors.AuthorizationError('Unauthorized, authorization token expired');
        
        // Dodaj token u req objekt za danju ubradu
        req.accessToken = authToken;
        // Pozovi sljedeći handler
        next();
    } catch (error) {
        next(error);
    }
}

exports.tempTokenAuth = async (req, res, next) => {
    try {
        // Izvadi authorization header is requesta
        const authorizationHeader = req.get('Authorization');
        // Ako header nije definiran vrati grešku
        if (!authorizationHeader || authorizationHeader === '')
            throw new errors.AuthorizationError('Unauthorized, temp authorization token not provided');
        // Izvadi djelove headera
        const authType =  authorizationHeader.split(' ')[0];
        const authTempToken = authorizationHeader.split(' ')[1];
        // Provjeri koristi li se odgovarajući tip autorizacije
        if (authType.toLowerCase() !== 'bearer')
            throw new errors.AuthorizationError('Unauthorized, authorization scheme not supported')
        // Provjeri je token definiran
        if (typeof(authTempToken) !== 'string')
            throw new errors.AuthorizationError('Unauthorized, temp authorization token not provided');
        
        // Probaj dobaviti podatke o korisniku za ovaj token
        const userData = await dbEmail.getUser({ tempToken: authTempToken });
        // Ako korisnik nije nađen autorizacija je neuspješna
        if (!userData)
            throw new errors.AuthorizationError('Unauthorized, provided temp authorization token is not valid');
        // Ako ne postoji zapis o tome kad je token napravljen to je jako čudno
        if (!userData.tempTokenCreated)
            throw new errors.InternalServerError('Token is valid, but server has no clue when was this token created');

        // Dobavi koliko vijedi temp token
        const tempTokenLifetime = Number.parseInt(await dbWeb.getOption('tempTokenLifetime'));
        // Ako vrijednost postavke nije broj neko od admina je neš zaribo
        if (isNaN(tempTokenLifetime))
            throw new errors.DatabaseError('Failed to parse settings from database to int');
        // Provjeri ako je sada kasnije od kada token ističe token je istekao
        if (userData.tempTokenCreated.getTime() + tempTokenLifetime * 1000 <= Date.now())
            throw new errors.AuthorizationError('Unauthorized, authorization token expired');
        
        // Dodaj token u req objekt za danju ubradu
        req.tempAccessToken = authTempToken;
        // Pozovi sljedeći handler
        next();
    } catch (error) {
        next(error);
    }
}