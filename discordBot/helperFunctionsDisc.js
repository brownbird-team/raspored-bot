baza = require("./databaseQueriesDisc.js");

exports.discordLog = async (logThis) => {
    console.log('[\u001b[34mDiscord\033[00m] ' + logThis);
}

// Pregledaj sve postavke u tablici disc_settings i kreiraj ih ako ne postoje
exports.checkOptions = async () => {
    // Postavi allGood na false ako je neki settings u takvom stanju da se bot
    // ne može pokrenuti
    let allGood = true;
    const token = await baza.getOption("token");
    if (!token) {
        baza.setOption("token", "");
        exports.discordLog("Token record nije pronađen, kreiram ga (ne pokrećem bota)");
        allGood = false;
    } else if (token.value === "") {
        exports.discordLog("Token record je prazan (ne pokrećem bota)");
        allGood = false;
    }
    const prefix = await baza.getOption("prefix");
    if (!prefix) {
        baza.setOption("prefix", ".");
        exports.discordLog("Prefix record nije pronađen, kreiram ga i postavljam na '.'");
    }
    const color = await baza.getOption("color");
    if (!color) {
        baza.setOption("color", "#05A134");
        exports.discordLog("Color record nije pronađen, kreiram ga i postavljam na #05A134");
    }
    const errorColor = await baza.getOption("errorColor");
    if (!errorColor) {
        baza.setOption("errorColor", "#f73131");
        exports.discordLog("errorColor record nije pronađen, kreiram ga i postavljam na #f73131");
    }
    const embedWaitingTime = await baza.getOption("embedWaitingTime");
    if (!embedWaitingTime) {
        baza.setOption("embedWaitingTime", '20000');
        exports.discordLog("embedWaitingTime record nije pronađen, kreiram ga i postavljam na 20000");
    }

    // Vrati allGood pozivatelju da obustavi pokretanje bota ako vrati false
    return allGood;
}