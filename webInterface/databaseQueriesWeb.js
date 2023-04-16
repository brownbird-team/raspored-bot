const { getOption, setOption } = require('./../databaseQueries.js');
const { promiseQuery } = require('../databaseConnect.js');
const errors = require('../errors.js');

// Vrati vrijednost optiona iz baze
exports.getOption = async (option) => {
    return await getOption('web_settings', option);
}

// Postavi novu vrijednost na option i kreiraj ga ako ne postoji
exports.setOption = async (option, value) => {
    return await setOption('web_settings', option, value);
}

// Dobavi korisnika prema nekom identifikatoru
exports.getUser = async (dataObject) => {
    const queryObject = {};
    // Dobavi korisnika prema id-u
    if (typeof(dataObject?.id) === 'number')
        queryObject.id = dataObject.id
    // Dobavi korisnika prema imenu
    else if (typeof(dataObject?.username) === 'string')
        queryObject.username = dataObject.username;
    // Dobavi korisnika prema tokenu
    else if (typeof(dataObject?.token) === 'string')
        queryObject.web_token = dataObject.token;
    // Ako ništa nije specificirano baci grešku
    else
        throw new errors.ValidationError('Failed to get user, no unique identificator is provided');
    // Dobavi korisnika
    const result = await promiseQuery(
        'SELECT id, username, password, web_token AS token, web_token_created AS tokenCreated FROM web_admin WHERE ?',
        [ queryObject ]
    );
    // Ako ne postoji vrati null
    if (result.length === 0)
        return null;

    return result[0];
}

// Dobavi listu korisnika
exports.getUsers = async () => {
    const results = await promiseQuery(
        'SELECT id, username FROM web_admin'
    );

    return results;
}

// Obriši danog korisnika
exports.deleteUser = async (userId) => {
    const result = await promiseQuery(
        'DELETE FROM web_admin WHERE id = ?'
        [ userId ]
    );

    if (result.affectedRows === 0)
        throw new errors.NotFoundError('Nothing to delete for given ID');
}

// Izmjeni danog korisnika
exports.updateUser = async (dataObject) => {
    const queryIdObject = {};
    // Izmjeni korisnika prema id-u
    if (typeof(dataObject?.id) === 'number')
        queryIdObject.id = dataObject.id
    // Izmjeni korisnika prema imenu
    else if (typeof(dataObject?.username) === 'string')
        queryIdObject.username = dataObject.username;
    // Izmjeni korisnika prema tokenu
    else if (typeof(dataObject?.token) === 'string')
        queryIdObject.web_token = dataObject.token;
    // Ako ništa nije specificirano baci grešku
    else
        throw new errors.ValidationError('Failed to get user, no unique identificator is provided');

    const queryUpdObject = {};
    if (dataObject.newPassword)
        queryUpdObject.password = dataObject.newPassword;
    if (dataObject.newToken || dataObject.newToken === null)
        queryUpdObject.web_token = dataObject.newToken;
    if (dataObject.newTokenCreated || dataObject.newTokenCreated === null)
        queryUpdObject.web_token_created = dataObject.newTokenCreated

    if (Object.keys(queryUpdObject).length > 0)
        await promiseQuery(
            'UPDATE web_admin SET ? WHERE ?',
            [ queryUpdObject, queryIdObject ]
        );
}

// Kreiraj korisnika
exports.createUser = async (dataObject) => {
    const insertThis = {};

    // Provjeri postojanje svih propertya
    if (typeof(dataObject.username) === 'string')
        insertThis.username = dataObject.username;
    if (typeof(dataObject.password) === 'string')
        insertThis.password = dataObject.password;
    if (typeof(dataObject.token) === 'string' || dataObject.token === null)
        insertThis.web_token = dataObject.token;
    if (dataObject.tokenCreated || dataObject.tokenCreated === null)
        insertThis.web_token_created = dataObject.web_token_created;

    if (Object.keys(insertThis).length > 0)
        await promiseQuery(
            'INSERT INTO web_admin SET ?',
            [ insertThis ]
        );
    else
        throw new errors.ValidationError('Failed to create user, nothing to insert');
}   