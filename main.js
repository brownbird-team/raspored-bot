const baza = require("./databaseQueries.js");

async function retardFunction () {
    result = await baza.dajPovijest(28, 2);
    console.log(result);
}

retardFunction();