const { promiseQuery } = require('./../databaseConnect.js');
const { getOption, setOption, dajRazredById, prepareForSQL } = require('./../databaseQueries.js');
const { formatDate } = require('./helperFunctionsEmail.js');
const errors = require('./../errors.js');
const dbWeb = require('./../webInterface/databaseQueriesWeb.js');

// U objektu je navedeno kako pretvoriti objekte koji predstavljaju podatke iz tablice
// email_korisnici u pikladan oblik za upis u tablicu
const objectToDatabase = {
// -------------------------------------------------------------------------------------------------------    
//  ime u objektu                    ime u bazi             pripremi vrijednost iz objekta za upis u bazu
// -------------------------------------------------------------------------------------------------------
    id                  : {  attrib: 'id',                  c: async v => v                      },
    email               : {  attrib: 'email',               c: async v => v                      },
    verified            : {  attrib: 'verified',            c: async v => v ? 1 : 0              },
    saljiSve            : {  attrib: 'salji_sve',           c: async v => v ? 1 : 0              },
    zadnjaPoslana       : {  attrib: 'zadnja_poslana',      c: async v => v                      },
    mute                : {  attrib: 'salji_izmjene',       c: async v => v ? 0 : 1              },
    theme               : {  attrib: 'web_theme',           c: async v => v                      },
    token               : {  attrib: 'web_token',           c: async v => v                      },
    tokenCreated        : {  attrib: 'web_token_created',   c: async v => formatDate(v)          },
    tempToken           : {  attrib: 'temp_token',          c: async v => v                      },
    tempTokenCreated    : {  attrib: 'temp_token_created',  c: async v => formatDate(v)          },
    razredId            : {  attrib: 'razred_id',           c: async v => v                      },
    tempTokenCount      : {  attrib: 'temp_token_count',    c: async v => v                      },
}

// U objektu je navedeno kako pretvoiti vrijednosti dobivene iz baze u oblik koji se
// koristi za danju obradu podataka
const databaseToObject = {
// -------------------------------------------------------------------------------------------------------    
//  ime u bazi                       ime u objektu          pripremi vrijednost iz objekta za upis u bazu
// -------------------------------------------------------------------------------------------------------
    id                  : {  attrib: 'id',                  c: async v => v                      },
    email               : {  attrib: 'email',               c: async v => v                      },
    verified            : {  attrib: 'verified',            c: async v => v === 1                },
    salji_sve           : {  attrib: 'saljiSve',            c: async v => v === 1                },
    zadnja_poslana      : {  attrib: 'zadnjaPoslana',       c: async v => v                      },
    salji_izmjene       : {  attrib: 'mute',                c: async v => !(v === 1)             },
    web_theme           : {  attrib: 'theme',               c: async v => v                      },
    web_token           : {  attrib: 'token',               c: async v => v                      },
    web_token_created   : {  attrib: 'tokenCreated',        c: async v => v                      },
    temp_token          : {  attrib: 'tempToken',           c: async v => v                      },
    temp_token_created  : {  attrib: 'tempTokenCreated',    c: async v => v                      },
    razred_id           : {  attrib: 'razred',              c: async v => await dajRazredById(v) },
    temp_token_count    : {  attrib: 'tempTokenCount',      c: async v => v                      },
}

// Vrati vrijednost optiona iz baze
exports.getOption = async (option) => {
    return await getOption('email_settings', option);
}

// Postavi novu vrijednost na option i kreiraj ga ako ne postoji
exports.setOption = async (option, value) => {
    return await setOption('email_settings', option, value);
}

// Kreiraj objekt prikladan za danju obradu od podataka iz baze
const formatDatabaseUser = async (databaseUserRecord) => {
    // Ako argument nije ok vradi null
    if (!databaseUserRecord)
        return null;

    let userObject = {};
    for (const key of Object.keys(databaseUserRecord)) {
        userObject[databaseToObject[key].attrib] = await databaseToObject[key].c(databaseUserRecord[key]);
    }

    return userObject;
}

// Daj podatke za traženog korisnika po email-u
exports.getUser = async (queryData) => {
    let query = `SELECT * FROM email_korisnici`;

    if (queryData.id)
        query += ` WHERE id = ${queryData.id};`;
    else if (queryData.email)
        query += ` WHERE email = '${prepareForSQL(queryData.email)}';`;
    else if (queryData.token)
        query += ` WHERE web_token = '${prepareForSQL(queryData.token)}';`;
    else if (queryData.tempToken)
        query += ` WHERE temp_token = '${prepareForSQL(queryData.tempToken)}';`;
    else
        throw new errors.DatabaseError('Failed to get user, neither email, id or token were provided');

    const result = await promiseQuery(query);
    // Ako korisnik ne postoji vrati null
    if (result.lenght === 0)
        return null;
    // Fromatiraj podatke i vrati ih
    return formatDatabaseUser(result[0]);
}

// Izlistaj sve usere iz baze i njihove emailove i status
exports.getUserList = async () => {
    const result = await promiseQuery(`SELECT id, email, verified FROM email_korisnici`);

    for (index in result) {
        result[index].verified = (result[index].verified === 1);
    }

    return result;
}

// Izmjeni korisnika u bazi
exports.updateUser = async (queryData, newUserData) => {
    let zarez = false;
    let query = 'UPDATE email_korisnici SET';

    for (const key of Object.keys(objectToDatabase)) {
        if (typeof(newUserData[key]) !== 'undefined') {
            if (zarez) query += ',';
            const value = await objectToDatabase[key].c(newUserData[key]);
            
            let queryValue;
            if (value === null)
                queryValue = null;
            else if (typeof(value) === 'string')
                queryValue = `'${prepareForSQL(value)}'`
            else
                queryValue = value

            query += ` ${objectToDatabase[key].attrib} = ${queryValue}`;
            zarez = true;
        }
    }

    if (query != 'UPDATE email_korisnici SET') {
        if (queryData.id)
        query += ` WHERE id = ${queryData.id};`;
        else if (queryData.email)
            query += ` WHERE email = '${prepareForSQL(queryData.email)}';`;
        else if (queryData.token)
            query += ` WHERE web_token = '${prepareForSQL(queryData.token)}';`;
        else if (queryData.tempToken)
            query += ` WHERE temp_token = '${prepareForSQL(queryData.tempToken)}';`;
        else
            throw new errors.DatabaseError('Failed to update user, neither email, id or token were provided');

        await promiseQuery(query);
    }

    return true;
}

exports.createUser = async (userData) => {
    // Ako id i email nisu definirani nemoguće umetnuti
    if (!userData.email)
        throw new errors.DatabaseError('Failed to create user, email property not defined');

    delete userData.id;

    let zarez = false;
    let query = 'INSERT INTO email_korisnici (';
    let valuesQuery = '(';

    for (const key of Object.keys(objectToDatabase)) {
        if (typeof(userData[key]) !== 'undefined') {
            if (zarez) query += ', ';
            if (zarez) valuesQuery += ', ';

            query += objectToDatabase[key].attrib;
            const value = await objectToDatabase[key].c(userData[key]);

            if (value === null)
                valuesQuery += null;
            else if (typeof(value) === 'string')
                valuesQuery += `'${prepareForSQL(value)}'`
            else
                valuesQuery += value
            
            zarez = true;
        }
    }

    if (valuesQuery !== '(') {
        query += `) VALUES ${valuesQuery})`
        await promiseQuery(query);
        return true;
    }
}

exports.deleteUser = async (queryData) => {
    let query = `DELETE FROM email_korisnici`;

    if (queryData.id)
        query += ` WHERE id = ${queryData.id};`;
    else if (queryData.email)
        query += ` WHERE email = '${prepareForSQL(queryData.email)}';`;
    else if (queryData.token)
        query += ` WHERE web_token = '${prepareForSQL(queryData.token)}';`;
    else if (queryData.tempToken)
        query += ` WHERE temp_token = '${prepareForSQL(queryData.tempToken)}';`;
    else
        throw new errors.DatabaseError('Failed to get user, neither email, id or token were provided');

    const result = await promiseQuery(query);
    // Ako korisnik ne postoji vrati null
    if (result.lenght === 0)
        return null;
    // Fromatiraj podatke i vrati ih
    return formatDatabaseUser(result[0]);
}

exports.clearUnverifiedExpired = async () => {
    const tempTokenLifetime = Number.parseInt(await dbWeb.getOption('tempTokenLifetime'));

    if (isNaN(tempTokenLifetime))
        throw new errors.DatabaseError('Failed to clear unverified users, tempTokenLifetime is not set');

    const query = `DELETE FROM email_korisnici WHERE DATE_ADD(temp_token_created, INTERVAL ${tempTokenLifetime} second) < NOW()`;

    await promiseQuery(query);
}