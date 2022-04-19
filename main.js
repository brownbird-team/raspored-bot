const baza = require('./databaseConnect.js');

async function retardFunction () {
    result = await baza.promiseQuery("SELECT * FROM general_razred");
    console.log(result);
}

retardFunction();