const { normalEmbed, errorEmbed } = require("../helperFunctionsDisc.js");
const baza = require('./../databaseQueriesDisc.js');

module.exports = {
    name: 'sve',
    admin: false,
    dmOnly: true,

    async execute(message) {

        const kanal = await baza.getKanal(message.author.id);
        const options = message.content.trim().split(' ').slice(1);
        const prefix = await baza.getPrefix(message.author.id);

        let embed;

        if (kanal) {
            const value = options[0];
            // I argument je da, izmjeni podatke za kanal u bazi
            if (value === 'da' && options.length === 1) {
                await baza.updateKanal({
                    id: message.author.id,
                    salji_sve: true
                });
                embed = await normalEmbed(
                    'Izmjena postavki za slanje izmjena',
                    'Od sada ćete primati **SVE** izmjene, bez obzira jesu li sva polja prazna za vaš razred'
                );
            // I argument je ne, izmjeni podatke za kanal u bazi
            } else  if (value === 'ne' && options.length === 1) {
                await baza.updateKanal({
                    id: message.author.id,
                    salji_sve: false
                });
                embed = await normalEmbed(
                    'Izmjena postavki za slanje izmjena',
                    'Od sada ćete primati izmjene **SAMO** ako se nešto promjenilo za vaš razred'
                );
            // Inače pošalji grešku
            } else {
                embed = await errorEmbed(
                    "Naredba nije pravilno definirana\nUpišite `" + prefix + "sve da/ne`"
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