const { getOption, setOption } = require("../database/queries/settingsTables");

// Vrati vrijednost optiona iz baze
exports.getOption = async (option) => {
    return await getOption('ras_web_setting', option);
}

// Postavi novu vrijednost na option i kreiraj ga ako ne postoji
exports.setOption = async (option, value) => {
    return await setOption('ras_web_setting', option, value);
}