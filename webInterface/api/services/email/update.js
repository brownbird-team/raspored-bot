const dbEmail = require('./../../../../emailBot/databaseQueriesEmail.js');
const dbPrim = require('./../../../../databaseQueries.js');
const errors = require('../../../../errors.js');

module.exports = async (dataObject) => {
    if (!dataObject.token || typeof(dataObject.token) != 'string')
        throw new errors.ValidationError('Token is not defined or of invalid type');
    
    let updateAccount = {};

    // Ako je svojstvo all postoji i ima odgovarajuću vrijednost postavi je, ako vrijednost ne valja vrati grešku
    if (typeof(dataObject.all) == 'boolean')
        updateAccount.saljiSve = dataObject.all;
    else if (typeof(dataObject.all) != 'undefined')
        throw new errors.ValidationError('property all can only hold values true or false');

    // Ako je svojstvo mute postoji i ima odgovarajuću vrijednost postavi je, ako vrijednost ne valja vrati grešku
    if (typeof(dataObject.mute) == 'boolean')
        updateAccount.mute = dataObject.mute;
    else if (typeof(dataObject.mute) != 'undefined')
        throw new errors.ValidationError('property mute can only hold values true or false');

    // Ako je svojstvo theme postoji i ima odgovarajuću vrijednost postavi je, ako vrijednost ne valja vrati grešku
    if (dataObject.theme === 'light' || dataObject.theme === 'dark')
        updateAccount.theme = dataObject.theme;
    else if (typeof(dataObject.theme) != 'undefined')
        throw new errors.ValidationError('property theme can only hold values "light" or "dark"');

    // Ako je definirana vrijednost razreda
    if (dataObject.class) {
        // Probaj ga dobaviti
        const razredData = await dbPrim.dajRazredByName(dbPrim.prepareForSQL(dataObject.class));

        // Ako razred postoji postavi ga, ako ne vrati grešku
        if (razredData) {
            updateAccount.razredId = razredData.id;
            const zadnjaIzmjena = await dbPrim.dajZadnju(razredData.id);
            updateAccount.zadnjaPoslana = zadnjaIzmjena.id;
        } else {
            throw new errors.NotFoundError('Requested class does not exist');
        }
    }
    
    await dbEmail.updateUser({ token: dataObject.token }, updateAccount);
}