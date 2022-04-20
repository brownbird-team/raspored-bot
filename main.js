const baza = require('./databaseConnect.js');

async function retardFunction () {
    let datum = "";
    const d = new Date()
    datum += d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    console.log(datum);
}

retardFunction();