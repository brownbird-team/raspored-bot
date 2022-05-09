const { errorEmbed, normalEmbed } = require('./../helperFunctionsDisc.js');
const baza = require("../databaseQueriesDisc.js");

module.exports = {
    name: 'postavke',
    admin: false,
    dmOnly: true,
    aliases: [],

    async execute(message) {
        const kanal = await baza.getKanal(message.author.id);
        const prefix = await baza.getPrefix(message.author.id);

        let embed;

        if (kanal) {
            // Pošalji podatke o kanalu iz baze
            embed = await normalEmbed(`Prikaz postavki za korisnika ${message.author.tag}`, null);
            embed.addFields({
                name: 'Razred',
                value: '```' + (kanal.razred ? kanal.razred.ime : 'Nije definiran') + '```'
            });
            embed.addFields({
                name: 'Šalji sve izmjene',
                value: '```' + (kanal.salji_sve ? 'DA' : 'NE') + '```'
            });
            embed.addFields({
                name: 'Šalji mi izmjene',
                value: '```' + (!kanal.mute ? 'DA' : 'NE') + '```'
            });
            embed.addFields({
                name: 'Prefix',
                value: '```' + (kanal.prefix ? kanal.prefix : `Prefix Raspored Bota "${prefix}"`) + '```'
            });
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