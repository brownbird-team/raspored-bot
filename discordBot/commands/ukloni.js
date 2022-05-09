const { errorEmbed, normalEmbed } = require('./../helperFunctionsDisc.js');
const baza = require("../databaseQueriesDisc.js");

module.exports = {
    name: 'ukloni',
    admin: false,
    dmOnly: true,
    aliases: [],

    async execute(message) {

        const kanal = await baza.getKanal(message.author.id);

        let embed;

        // Ako je kanal već u bazi
        if (!kanal) {
            embed = await errorEmbed(`Korisnik ${message.author.tag} se ne nalazi u bazi Raspored Bota`);
        } else {
            // Inače dodaj kanal u bazu
            await baza.removeKanal(message.author.id);
            embed = await normalEmbed(
                'Uklanjam korisnika iz baze Raspored Bota',
                `Korisnik ${message.author.tag} uklonjen je iz baze Raspored Bota`
            );
        }

        await message.reply({
            embeds: [ embed ],
            allowedMentions: { repliedUser: false },
        })
    }
}