const { MessageEmbed } = require("discord.js");
const baza = require("./databaseQueriesDisc.js");

exports.discordLog = async (logThis) => {
    console.log('[\u001b[34mDiscord\033[00m] ' + logThis);
}

exports.errorEmbed = async (error) => {
    const errorColor = await baza.getOption('errorColor');
    const footer = await baza.getOption('embedFooter');

    const embed = new MessageEmbed()
        .setTitle('Pogreška')
        .setColor(errorColor.value)
        .setTimestamp()
        .setFooter({ text: footer.value })
        .addFields({
            name: 'Opis pogreške:',
            value: error
        });

    return embed;
}

exports.normalEmbed = async (title, desc) => {
    const color = await baza.getOption('color');
    const footer = await baza.getOption('embedFooter');

    const embed = new MessageEmbed()
        .setTitle(title)
        .setColor(color.value)
        .setTimestamp()
        .setFooter({ text: footer.value })

    if (desc) {
        embed.setDescription(desc);
    }

    return embed;
}

exports.formatDateString = (dateString) => {
    const dateObject = new Date(dateString);
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = String(dateObject.getFullYear()).padStart(4, '0');
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    result = `${day}-${month}-${year} ${hours}:${minutes}`
    return result;
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
    const helpWaitingTime = await baza.getOption("helpWaitingTime");
    if (!helpWaitingTime) {
        baza.setOption("helpWaitingTime", '120000');
        exports.discordLog("helpWaitingTime record nije pronađen, kreiram ga i postavljam na 120000");
    }
    const embedFooter = await baza.getOption("embedFooter");
    if (!embedFooter) {
        baza.setOption("embedFooter", 'RasporedBot by BrownBird Team');
        exports.discordLog("embedFooter record nije pronađen, kreiram ga i postavljam na 'RasporedBot by BrownBird Team'");
    }
    const activityType = await baza.getOption("activityType");
    if (!activityType) {
        baza.setOption("activityType", 'WATCHING');
        exports.discordLog("activityType record nije pronađen, kreiram ga i postavljam na WATCHING");
    }
    const activityText = await baza.getOption("activityText");
    if (!activityText) {
        baza.setOption("activityText", 'for schedule changes');
        exports.discordLog("activityText record nije pronađen, kreiram ga i postavljam na 'for schedule changes'");
    }

    // Vrati allGood pozivatelju da obustavi pokretanje bota ako vrati false
    return allGood;
}