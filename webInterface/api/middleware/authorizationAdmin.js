const errors = require('./../../../errors.js');
const dbWeb = require('./../../databaseQueriesWeb.js');

// Izvrši autorizaciju pomoću pristupnog tokena
exports.tokenAuth = async (req, res, next) => {
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
        const userData = await dbWeb.getUser({ token: authToken });
        // Ako korisnik nije nađen
        if (!userData)
            throw new errors.AuthorizationError('Unauthorized, provoded authorization token is not valid');
        // Ako ne postoji zapis o tome kad je token napravljen to je jako čudno
        if (!userData.tokenCreated)
            throw new errors.InternalServerError('Token is valid, but server has no clue when was this token created');

        // Dobavi koliko vijedi perm token
        const adminTokenLifetime = Number.parseInt(await dbWeb.getOption('adminTokenLifetime'));
        // Ako vrijednost postavke nije broj neko od admina je neš zaribo
        if (isNaN(adminTokenLifetime))
            throw new errors.DatabaseError('Failed to parse settings from database to int');
        // Provjeri ako je sada kasnije od kada token ističe token je istekao
        if (userData.tokenCreated.getTime() + adminTokenLifetime * 1000 <= Date.now())
            throw new errors.AuthorizationError('Unauthorized, authorization token expired');
        
        // Dodaj token u req objekt za danju ubradu
        req.accessToken = authToken;
        // Pozovi sljedeći handler
        next();
    } catch (error) {
        next(error);
    }
}