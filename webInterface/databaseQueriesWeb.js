const { getOption, setOption } = require('./../databaseQueries.js');

// Vrati vrijednost optiona iz baze
exports.getOption = async (option) => {
    return await getOption('web_settings', option);
}

// Postavi novu vrijednost na option i kreiraj ga ako ne postoji
exports.setOption = async (option, value) => {
    return await setOption('web_settings', option, value);
}