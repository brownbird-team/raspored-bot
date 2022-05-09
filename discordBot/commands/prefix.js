const { errorEmbed, normalEmbed } = require('./../helperFunctionsDisc.js');
const { prepareForSQL, onlyASCII } = require('./../../databaseQueries.js');
const baza = require('./../databaseQueriesDisc.js');

module.exports = {
    name: 'prefix',
    admin: false,
    dmOnly: true,
    aliases: [],

    async execute(message) {
        const kanal = await baza.getKanal(message.author.id);
        const options = message.content.trim().split(' ').slice(1);

        let embed;

        if (kanal) {
            // Ako ima više od jednog argumenta pošalji grešku
            if (options.length > 1) {
                embed = await errorEmbed("Prefix ne smije sadržavati razmake");
            // Ako ima manje od jednog argumenta pošalji grešku
            } else if (options.length < 1) {
                embed = await errorEmbed("Prefix nije definiran");
            } else if (!onlyASCII(options[0])) {
                embed = await errorEmbed("Prefix sadrži nevaljane znakove, provjerite sadrži li prefix samo ASCII znakove");
            // Inače izmjeni podatke za prefix kanala u bazi
            } else {
                baza.updateKanal({
                    id: message.author.id,
                    prefix: prepareForSQL(options[0])
                });
                embed = await normalEmbed(
                    `Izmjena prefixa za korisnika ${message.author.tag}`,
                    `Vaš prefix postavljen je na** ${options[0]} **`
                );
            }
        } else {
            embed = await errorEmbed(
                `Korisnik ${message.author.tag} ne postoji u bazi Raspored Bota\nMorate biti u bazi kako bi mogli mijenjati postavke`
            );
        }

        await message.reply({
            embeds: [ embed ],
            allowedMentions: { repliedUser: false }
        });
    }
}